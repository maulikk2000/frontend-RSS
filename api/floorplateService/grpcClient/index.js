/* eslint-disable */
// @ts-nocheck

import * as THREE from "three";
import { FloorPlateClient } from "./floorplate_grpc_web_pb";
import {
  FloorPlateRequest,
  RequestContext,
  FloorPlateData,
  CornerApt,
  DeadEnd,
  UnitMix,
  Vector2
} from "./floorplate_pb";
import { getMeshLambertMaterialInstance } from "../../../utils/materialUtils";
import materialColors from "styling/materialColors.module.scss";
import { materialLibrary } from "utils/materialLibrary";
import { FPLRequestBuilder, SFPLRequestBuilder } from "./requestBuilders"
import colourMap from "./colourMap.json";
const EventEmitter = require("events");

export class BoundaryRenderer extends EventEmitter{
     
  constructor(
      fpClientUrl
  ){
      super();
      this.fpClient = new FloorPlateClient(fpClientUrl);
      this.hashMap = {};
      this.inProcItms = {};
      this.postponedItms = {};
      this.colourMap = {};
  };
  
  /*Load a floorplate with the specified FloorPlateRequest model*/
  loadFloorPlate(req, canvas){
      console.log("Loading floor plate ...");
      if(!this.fpClient){
          throw 'Missing gRPC client ref';    
      }
      if(!canvas || !canvas.ready){
          throw 'Missing canvas ref or canvas not ready!';
      }
      const stream  = this.fpClient.getBoundaries(req, {});
      stream.on("data", (msg) => { 
        try {
          const mObj = msg.toObject();
          if(this.inProcItms.hasOwnProperty(mObj.hash))
          {
              if(!this.postponedItms.hasOwnProperty(mObj.hash)){
                  this.postponedItms[mObj.hash] = [];
              }
              this.postponedItms[mObj.hash].push(mObj);
              this.emit("postponed", mObj.itemId);
          }
          this.processBoundaryItem(mObj, canvas) } catch (e) {
            console.error(e)
          }
      });
  }

  loadStackedFloorPlate(req, canvas){
      console.log("Loading stacked floor plate ...");
      if(!this.fpClient){
          throw 'Missing gRPC client ref';    
      }
      if(!canvas || !canvas.ready){
          throw 'Missing canvas ref or canvas not ready!';
      }
      const stream  = this.fpClient.getStackedBoundaries(req, {});
      stream.on("data", (msg) => { 
          const mObj = msg.toObject();
          if(this.inProcItms.hasOwnProperty(mObj.hash))
          {
              if(!this.postponedItms.hasOwnProperty(mObj.hash)){
                  this.postponedItms[mObj.hash] = [];
              }
              this.postponedItms[mObj.hash].push(mObj);
              this.emit("postponed", mObj.itemId);
          }
          this.processBoundaryItem(mObj, canvas) 
      });
  }

  processBoundaryItem(mObj, canvas)
  {
      //console.log(mObj.itemId + " : " + mObj.hash);
      if(this.hashMap.hasOwnProperty(mObj.hash)){
          const clonedMesh = this.hashMap[mObj.hash].clone(true);
          clonedMesh.position.set(mObj.position.x, mObj.position.y, mObj.position.z);
          this.renderMesh(canvas, clonedMesh, mObj.itemId, mObj.hash);
          return;
      }

      this.inProcItms[mObj.hash] = mObj;
      
      const shape = new THREE.Shape();                
      let fObj = mObj.boundaryList[0];        
      let lObj = {x:0,y:0};
      shape.moveTo(fObj.x, fObj.y);
      for(let i = 1; i < mObj.boundaryList.length; ++i){
          let v2 = mObj.boundaryList[i];
          shape.lineTo(v2.x,v2.y);
          if(i == mObj.boundaryList.length -1){
              lObj = {x: v2.x, y: v2.y};
          }
      }
      /* ensure shape path is closed */
      if(fObj.x != lObj.x || fObj.y != lObj.y){
          shape.lineTo(fObj.x, fObj.y);
      }
      /* Extrude boundary */
      const extOpts = {steps : 1, bevelEnabled: false, depth: mObj.height};
      const extObj = new THREE.ExtrudeGeometry(shape, extOpts);

      /*TODO: Add render material options */
      //const mat = new THREE.MeshBasicMaterial( { color: 0xFFF69D } );
      const mat = this.getRenderMat(mObj);
      const boundMesh = new THREE.Mesh(extObj, mat);
      
      this.renderMesh(canvas, boundMesh, mObj.itemId, mObj.hash);        
  }

  renderMesh(canvas, mesh, itemId, hash){
      if(!canvas || !canvas.ready){
          throw 'Failed to render as canvas not ready at render time!';
      }
      canvas.scene.add(mesh);
      
      /* Cache boundary by hash for re-use */
      if(!this.hashMap.hasOwnProperty(hash)){
          this.hashMap[hash] = mesh.clone(true);
      }
      /* Raise rendered event */
      this.rendered(itemId, hash);
  }

  getRenderMat(msgObj){
      const mat = new THREE.MeshLambertMaterial();

      if(msgObj.colour){
          //console.log(`Using user defined material for : ${msgObj.label} : ${msgObj.colour}`);
          mat.color.set(new THREE.Color(msgObj.colour));
          return mat;
      }
      let materialType = msgObj.label;
      if(colourMap.hasOwnProperty(materialType)){
          //console.log(`Using defined material for : ${materialType}`);
          mat.color.set(new THREE.Color(`#${colourMap[materialType]}`));           
          return mat;
      }
      /* Default material */
      //console.log(`Using default material for : ${materialType}`);
      return new THREE.MeshLambertMaterial( { color: 0x012428 } );
  }

  renderPostponed(hash, canvas){
      if(!this.postponedItms.hasOwnProperty(hash)) return;

      const pArr = this.postponedItms[hash];
      console.log(JSON.stringify(pArr));
      delete this.postponedItms[hash];
      for (let i = 0; i < pArr.length; ++i) {
          this.processBoundaryItem(pArr[i], canvas);            
      }
  }

  rendered(id, hash, canvas){
      delete this.inProcItms[hash];        
      this.emit("rendered", {id:id, hash:hash});
      this.renderPostponed(hash, canvas);
  }
}
