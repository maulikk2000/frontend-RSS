/**
 * @fileoverview gRPC-Web generated client stub for pulsar
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.pulsar = require('./floorplate_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.pulsar.FloorPlateClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.pulsar.FloorPlatePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.pulsar.FloorPlateRequest,
 *   !proto.pulsar.BoundaryGeometry>}
 */
const methodDescriptor_FloorPlate_GetBoundaries = new grpc.web.MethodDescriptor(
  '/pulsar.FloorPlate/GetBoundaries',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.pulsar.FloorPlateRequest,
  proto.pulsar.BoundaryGeometry,
  /**
   * @param {!proto.pulsar.FloorPlateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pulsar.BoundaryGeometry.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.pulsar.FloorPlateRequest,
 *   !proto.pulsar.BoundaryGeometry>}
 */
const methodInfo_FloorPlate_GetBoundaries = new grpc.web.AbstractClientBase.MethodInfo(
  proto.pulsar.BoundaryGeometry,
  /**
   * @param {!proto.pulsar.FloorPlateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pulsar.BoundaryGeometry.deserializeBinary
);


/**
 * @param {!proto.pulsar.FloorPlateRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.pulsar.BoundaryGeometry>}
 *     The XHR Node Readable Stream
 */
proto.pulsar.FloorPlateClient.prototype.getBoundaries =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/pulsar.FloorPlate/GetBoundaries',
      request,
      metadata || {},
      methodDescriptor_FloorPlate_GetBoundaries);
};


/**
 * @param {!proto.pulsar.FloorPlateRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.pulsar.BoundaryGeometry>}
 *     The XHR Node Readable Stream
 */
proto.pulsar.FloorPlatePromiseClient.prototype.getBoundaries =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/pulsar.FloorPlate/GetBoundaries',
      request,
      metadata || {},
      methodDescriptor_FloorPlate_GetBoundaries);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.pulsar.StackedFloorPlateRequest,
 *   !proto.pulsar.BoundaryGeometry>}
 */
const methodDescriptor_FloorPlate_GetStackedBoundaries = new grpc.web.MethodDescriptor(
  '/pulsar.FloorPlate/GetStackedBoundaries',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.pulsar.StackedFloorPlateRequest,
  proto.pulsar.BoundaryGeometry,
  /**
   * @param {!proto.pulsar.StackedFloorPlateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pulsar.BoundaryGeometry.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.pulsar.StackedFloorPlateRequest,
 *   !proto.pulsar.BoundaryGeometry>}
 */
const methodInfo_FloorPlate_GetStackedBoundaries = new grpc.web.AbstractClientBase.MethodInfo(
  proto.pulsar.BoundaryGeometry,
  /**
   * @param {!proto.pulsar.StackedFloorPlateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pulsar.BoundaryGeometry.deserializeBinary
);


/**
 * @param {!proto.pulsar.StackedFloorPlateRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.pulsar.BoundaryGeometry>}
 *     The XHR Node Readable Stream
 */
proto.pulsar.FloorPlateClient.prototype.getStackedBoundaries =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/pulsar.FloorPlate/GetStackedBoundaries',
      request,
      metadata || {},
      methodDescriptor_FloorPlate_GetStackedBoundaries);
};


/**
 * @param {!proto.pulsar.StackedFloorPlateRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.pulsar.BoundaryGeometry>}
 *     The XHR Node Readable Stream
 */
proto.pulsar.FloorPlatePromiseClient.prototype.getStackedBoundaries =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/pulsar.FloorPlate/GetStackedBoundaries',
      request,
      metadata || {},
      methodDescriptor_FloorPlate_GetStackedBoundaries);
};


module.exports = proto.pulsar;

