/**
 * @fileoverview gRPC-Web generated client stub for pulsar.massing
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as massing_pb from './massing_pb';


export class MassingConfigurationServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoCreateMassingConfiguration = new grpcWeb.AbstractClientBase.MethodInfo(
    massing_pb.MassingConfiguration,
    (request: massing_pb.CreateMassingConfigurationRequest) => {
      return request.serializeBinary();
    },
    massing_pb.MassingConfiguration.deserializeBinary
  );

  createMassingConfiguration(
    request: massing_pb.CreateMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null): Promise<massing_pb.MassingConfiguration>;

  createMassingConfiguration(
    request: massing_pb.CreateMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: massing_pb.MassingConfiguration) => void): grpcWeb.ClientReadableStream<massing_pb.MassingConfiguration>;

  createMassingConfiguration(
    request: massing_pb.CreateMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: massing_pb.MassingConfiguration) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.massing.MassingConfigurationService/CreateMassingConfiguration',
        request,
        metadata || {},
        this.methodInfoCreateMassingConfiguration,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.massing.MassingConfigurationService/CreateMassingConfiguration',
    request,
    metadata || {},
    this.methodInfoCreateMassingConfiguration);
  }

  methodInfoGetMassingConfiguration = new grpcWeb.AbstractClientBase.MethodInfo(
    massing_pb.MassingConfiguration,
    (request: massing_pb.GetMassingConfigurationRequest) => {
      return request.serializeBinary();
    },
    massing_pb.MassingConfiguration.deserializeBinary
  );

  getMassingConfiguration(
    request: massing_pb.GetMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null): Promise<massing_pb.MassingConfiguration>;

  getMassingConfiguration(
    request: massing_pb.GetMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: massing_pb.MassingConfiguration) => void): grpcWeb.ClientReadableStream<massing_pb.MassingConfiguration>;

  getMassingConfiguration(
    request: massing_pb.GetMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: massing_pb.MassingConfiguration) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.massing.MassingConfigurationService/GetMassingConfiguration',
        request,
        metadata || {},
        this.methodInfoGetMassingConfiguration,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.massing.MassingConfigurationService/GetMassingConfiguration',
    request,
    metadata || {},
    this.methodInfoGetMassingConfiguration);
  }

  methodInfoUpdateMassingConfiguration = new grpcWeb.AbstractClientBase.MethodInfo(
    massing_pb.MassingConfiguration,
    (request: massing_pb.UpdateMassingConfigurationRequest) => {
      return request.serializeBinary();
    },
    massing_pb.MassingConfiguration.deserializeBinary
  );

  updateMassingConfiguration(
    request: massing_pb.UpdateMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null): Promise<massing_pb.MassingConfiguration>;

  updateMassingConfiguration(
    request: massing_pb.UpdateMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: massing_pb.MassingConfiguration) => void): grpcWeb.ClientReadableStream<massing_pb.MassingConfiguration>;

  updateMassingConfiguration(
    request: massing_pb.UpdateMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: massing_pb.MassingConfiguration) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.massing.MassingConfigurationService/UpdateMassingConfiguration',
        request,
        metadata || {},
        this.methodInfoUpdateMassingConfiguration,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.massing.MassingConfigurationService/UpdateMassingConfiguration',
    request,
    metadata || {},
    this.methodInfoUpdateMassingConfiguration);
  }

  methodInfoDeleteMassingConfiguration = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: massing_pb.DeleteMassingConfigurationRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteMassingConfiguration(
    request: massing_pb.DeleteMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteMassingConfiguration(
    request: massing_pb.DeleteMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteMassingConfiguration(
    request: massing_pb.DeleteMassingConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.massing.MassingConfigurationService/DeleteMassingConfiguration',
        request,
        metadata || {},
        this.methodInfoDeleteMassingConfiguration,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.massing.MassingConfigurationService/DeleteMassingConfiguration',
    request,
    metadata || {},
    this.methodInfoDeleteMassingConfiguration);
  }

  methodInfoCreateMassing = new grpcWeb.AbstractClientBase.MethodInfo(
    massing_pb.Massing,
    (request: massing_pb.CreateMassingRequest) => {
      return request.serializeBinary();
    },
    massing_pb.Massing.deserializeBinary
  );

  createMassing(
    request: massing_pb.CreateMassingRequest,
    metadata: grpcWeb.Metadata | null): Promise<massing_pb.Massing>;

  createMassing(
    request: massing_pb.CreateMassingRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: massing_pb.Massing) => void): grpcWeb.ClientReadableStream<massing_pb.Massing>;

  createMassing(
    request: massing_pb.CreateMassingRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: massing_pb.Massing) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.massing.MassingConfigurationService/CreateMassing',
        request,
        metadata || {},
        this.methodInfoCreateMassing,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.massing.MassingConfigurationService/CreateMassing',
    request,
    metadata || {},
    this.methodInfoCreateMassing);
  }

  methodInfoUpdateMassing = new grpcWeb.AbstractClientBase.MethodInfo(
    massing_pb.Massing,
    (request: massing_pb.UpdateMassingRequest) => {
      return request.serializeBinary();
    },
    massing_pb.Massing.deserializeBinary
  );

  updateMassing(
    request: massing_pb.UpdateMassingRequest,
    metadata: grpcWeb.Metadata | null): Promise<massing_pb.Massing>;

  updateMassing(
    request: massing_pb.UpdateMassingRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: massing_pb.Massing) => void): grpcWeb.ClientReadableStream<massing_pb.Massing>;

  updateMassing(
    request: massing_pb.UpdateMassingRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: massing_pb.Massing) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.massing.MassingConfigurationService/UpdateMassing',
        request,
        metadata || {},
        this.methodInfoUpdateMassing,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.massing.MassingConfigurationService/UpdateMassing',
    request,
    metadata || {},
    this.methodInfoUpdateMassing);
  }

  methodInfoDeleteMassing = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: massing_pb.DeleteMassingRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteMassing(
    request: massing_pb.DeleteMassingRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteMassing(
    request: massing_pb.DeleteMassingRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteMassing(
    request: massing_pb.DeleteMassingRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.massing.MassingConfigurationService/DeleteMassing',
        request,
        metadata || {},
        this.methodInfoDeleteMassing,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.massing.MassingConfigurationService/DeleteMassing',
    request,
    metadata || {},
    this.methodInfoDeleteMassing);
  }

}

