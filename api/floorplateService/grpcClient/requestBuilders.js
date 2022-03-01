import { 
    StackedFloorPlateRequest,
    StackedFloorPlateData,
    FloorPlateRequest, 
    RequestContext, 
    FloorPlateData,
    LayoutConfiguration,
    CornerApt,
    DeadEnd, 
    UnitMix,
    Vector2 } from "./floorplate_pb"

export class SFPLRequestBuilder{
    constructor(
        sfpReqData,
    ){      
        this.reqCtx = {userId:"c9c94315-3055-41ed-989f-22a82ed006c7",requestId:"60c04c9c0e7c8dde4b63e1fd"};
        this.sfpData = sfpReqData;
    }

    getRequestMessage(){
                /* init fp request models */
                const sfpReq = new StackedFloorPlateRequest();    
                const reqCtx = new RequestContext();
                const sfpData = new StackedFloorPlateData();
                const fpData = new FloorPlateData();
                const intCrnrApt = new CornerApt();
                const extCrnrApt = new CornerApt();
                const dEnd = new DeadEnd();
                const uMix1 = new UnitMix();
                const uMix2 = new UnitMix();
                const uMix3 = new UnitMix();

                /*Add request ctx */
                sfpReq.setRequestCtx(reqCtx);                
                sfpReq.addRequestData(sfpData); /* wired for single fp but can be changed to multi fp setup */
       
                /*Add floor plate models */
                fpData.addCorners(extCrnrApt);
                fpData.addCorners(intCrnrApt);
                fpData.addDeadEnds(dEnd);
                fpData.addUnitMixes(uMix1);
                fpData.addUnitMixes(uMix2);
                fpData.addUnitMixes(uMix3);
                
                /* set req ctx data */
                reqCtx.setUserId(this.reqCtx.userId);
                reqCtx.setRequestId(this.reqCtx.requestId);

                /* set sfp data (wiring for single floorplate definition)*/
                sfpData.setFloorHeight(this.sfpData.floorHeight);
                sfpData.setFloorCount(this.sfpData.floorCount);
                sfpData.setLayout(fpData);

                
                /* set fp data */
                fpData.setCorridorWidth(this.sfpData.corridorWidth);
                fpData.setApartmentDepth(this.sfpData.apartmentDepth);
                fpData.setVerticalTransportStrategy("SideCore");             
                fpData.setMinEgressDistance(1);
                fpData.setNumberOfLifts(1);
        
                /* Add spine point vectors */
                for(let i = 0; i < this.sfpData.spinePoints.length; ++i){
                    let vec2 = new Vector2();
                    vec2.setX(this.sfpData.spinePoints[i].x);
                    vec2.setY(this.sfpData.spinePoints[i].y);
                    fpData.addSpinePoints(vec2);
                }
        
                /* set corner apartemnt data */
                intCrnrApt.setAptId("dummy_int_crnr_apt");
                intCrnrApt.setAptId("dummy_ext_crnr_apt");
                
                /* set deadend data */        
                dEnd.addApartments("de_1");
                dEnd.addApartments("de_2");
                dEnd.setSpineVertexIndex(1);
                dEnd.setCorridorOffset(1);
                dEnd.setCorridorConfiguration("Open");
                
                /* set unit mixes */
                uMix1.setAptId("60c04c9c0e7c8dde4b63e1fe")
                uMix1.setPercentage(20);
                uMix2.setAptId("60c04c9c0e7c8dde4b63e1ff")
                uMix2.setPercentage(20);    
                uMix3.setAptId("60c04c9c0e7c8dde4b63e200")
                uMix3.setPercentage(10);
                uMix3.setAptId("60c04c9c0e7c8dde4b63e201")
                uMix3.setPercentage(30);
                uMix3.setAptId("60c04c9c0e7c8dde4b63e202")
                uMix3.setPercentage(20);
                return sfpReq;
    }
}

export class FPLRequestBuilder{
    constructor(
        fpReqData
    ){
        this.reqCtx = {userId:"c9c94315-3055-41ed-989f-22a82ed006c7",requestId:"c9c94315-3055-41ed-989f-22a82ed006c7"};
        this.fpData = fpReqData;
    }

    getRequestMessage(){
        /* init fp request models */
        const fpReq = new FloorPlateRequest();    
        const reqCtx = new RequestContext();
        const fpData = new FloorPlateData();
        const intCrnrApt = new CornerApt();
        const extCrnrApt = new CornerApt();
        const dEnd = new DeadEnd();
        const uMix1 = new UnitMix();
        const uMix2 = new UnitMix();
        const uMix3 = new UnitMix();
        
        /*Add request ctx */
        fpReq.setRequestCtx(reqCtx);
       
        /*Add floor plate models */
        fpReq.setRequestData(fpData);
        fpData.addCorners(extCrnrApt);
        fpData.addCorners(intCrnrApt);
        fpData.addDeadEnds(dEnd);
        fpData.addUnitMixes(uMix1);
        fpData.addUnitMixes(uMix2);
        fpData.addUnitMixes(uMix3);

        /* set layout configuration */
        switch(this.fpData.layoutConfiguration){
            case "floorplate":
                fpData.setLayoutConfiguration(LayoutConfiguration.LAYOUT_FLOOR_PLATE);
                break;
            case "apartment":
                fpData.setLayoutConfiguration(LayoutConfiguration.LAYOUT_APARTMENT);
                break;
        }

        /* set req ctx data */
        reqCtx.setUserId(this.reqCtx.userId);
        reqCtx.setRequestId(this.reqCtx.requestId)

        /* set fp data */
        fpData.setCorridorWidth(this.fpData.corridorWidth);
        fpData.setApartmentDepth(this.fpData.apartmentDepth);
        fpData.setVerticalTransportStrategy("SideCore");             
        fpData.setMinEgressDistance(1);
        fpData.setNumberOfLifts(1);

        /* Add spine point vectors */
        for(let i = 0; i < this.fpData.spinePoints.length; ++i){
            let vec2 = new Vector2();
            vec2.setX(this.fpData.spinePoints[i].x);
            vec2.setY(this.fpData.spinePoints[i].y);
            fpData.addSpinePoints(vec2);
        }

        /* set corner apartemnt data */
        intCrnrApt.setAptId("dummy_int_crnr_apt");
        intCrnrApt.setAptId("dummy_ext_crnr_apt");
        
        /* set deadend data */        
        dEnd.addApartments("de_1");
        dEnd.addApartments("de_2");
        dEnd.setSpineVertexIndex(1);
        dEnd.setCorridorOffset(1);
        dEnd.setCorridorConfiguration("Open");
        
        /* set unit mixes */
        uMix1.setAptId("60e24f68375898cc0676652e")
        uMix1.setPercentage(20);
        uMix2.setAptId("60e24f68375898cc0676652f")
        uMix2.setPercentage(20);    
        uMix3.setAptId("60e24f68375898cc06766530")
        uMix3.setPercentage(10);
        return fpReq;
    }
}