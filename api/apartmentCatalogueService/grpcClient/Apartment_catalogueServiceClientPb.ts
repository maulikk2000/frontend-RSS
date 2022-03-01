/**
 * @fileoverview gRPC-Web generated client stub for pulsar.apartment
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as apartment_pb from './apartment_pb';
import * as apartment_catalogue_pb from './apartment_catalogue_pb';


export class ApartmentCatalogueServiceClient {
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

  methodInfoGetApartmentCatalogue = new grpcWeb.AbstractClientBase.MethodInfo(
    apartment_catalogue_pb.ApartmentCatalogue,
    (request: apartment_catalogue_pb.GetApartmentCatalogueRequest) => {
      return request.serializeBinary();
    },
    apartment_catalogue_pb.ApartmentCatalogue.deserializeBinary
  );

  getApartmentCatalogue(
    request: apartment_catalogue_pb.GetApartmentCatalogueRequest,
    metadata: grpcWeb.Metadata | null): Promise<apartment_catalogue_pb.ApartmentCatalogue>;

  getApartmentCatalogue(
    request: apartment_catalogue_pb.GetApartmentCatalogueRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: apartment_catalogue_pb.ApartmentCatalogue) => void): grpcWeb.ClientReadableStream<apartment_catalogue_pb.ApartmentCatalogue>;

  getApartmentCatalogue(
    request: apartment_catalogue_pb.GetApartmentCatalogueRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: apartment_catalogue_pb.ApartmentCatalogue) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.apartment.ApartmentCatalogueService/GetApartmentCatalogue',
        request,
        metadata || {},
        this.methodInfoGetApartmentCatalogue,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.apartment.ApartmentCatalogueService/GetApartmentCatalogue',
    request,
    metadata || {},
    this.methodInfoGetApartmentCatalogue);
  }

  methodInfoCreateApartmentCatalogue = new grpcWeb.AbstractClientBase.MethodInfo(
    apartment_catalogue_pb.ApartmentCatalogue,
    (request: apartment_catalogue_pb.CreateApartmentCatalogueRequest) => {
      return request.serializeBinary();
    },
    apartment_catalogue_pb.ApartmentCatalogue.deserializeBinary
  );

  createApartmentCatalogue(
    request: apartment_catalogue_pb.CreateApartmentCatalogueRequest,
    metadata: grpcWeb.Metadata | null): Promise<apartment_catalogue_pb.ApartmentCatalogue>;

  createApartmentCatalogue(
    request: apartment_catalogue_pb.CreateApartmentCatalogueRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: apartment_catalogue_pb.ApartmentCatalogue) => void): grpcWeb.ClientReadableStream<apartment_catalogue_pb.ApartmentCatalogue>;

  createApartmentCatalogue(
    request: apartment_catalogue_pb.CreateApartmentCatalogueRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: apartment_catalogue_pb.ApartmentCatalogue) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.apartment.ApartmentCatalogueService/CreateApartmentCatalogue',
        request,
        metadata || {},
        this.methodInfoCreateApartmentCatalogue,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.apartment.ApartmentCatalogueService/CreateApartmentCatalogue',
    request,
    metadata || {},
    this.methodInfoCreateApartmentCatalogue);
  }

  methodInfoUpdateApartmentConfiguration = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: apartment_catalogue_pb.UpdateApartmentConfigurationRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  updateApartmentConfiguration(
    request: apartment_catalogue_pb.UpdateApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  updateApartmentConfiguration(
    request: apartment_catalogue_pb.UpdateApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  updateApartmentConfiguration(
    request: apartment_catalogue_pb.UpdateApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.apartment.ApartmentCatalogueService/UpdateApartmentConfiguration',
        request,
        metadata || {},
        this.methodInfoUpdateApartmentConfiguration,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.apartment.ApartmentCatalogueService/UpdateApartmentConfiguration',
    request,
    metadata || {},
    this.methodInfoUpdateApartmentConfiguration);
  }

  methodInfoAddApartmentConfiguration = new grpcWeb.AbstractClientBase.MethodInfo(
    apartment_pb.ApartmentConfiguration,
    (request: apartment_catalogue_pb.AddApartmentConfigurationRequest) => {
      return request.serializeBinary();
    },
    apartment_pb.ApartmentConfiguration.deserializeBinary
  );

  addApartmentConfiguration(
    request: apartment_catalogue_pb.AddApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null): Promise<apartment_pb.ApartmentConfiguration>;

  addApartmentConfiguration(
    request: apartment_catalogue_pb.AddApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: apartment_pb.ApartmentConfiguration) => void): grpcWeb.ClientReadableStream<apartment_pb.ApartmentConfiguration>;

  addApartmentConfiguration(
    request: apartment_catalogue_pb.AddApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: apartment_pb.ApartmentConfiguration) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.apartment.ApartmentCatalogueService/AddApartmentConfiguration',
        request,
        metadata || {},
        this.methodInfoAddApartmentConfiguration,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.apartment.ApartmentCatalogueService/AddApartmentConfiguration',
    request,
    metadata || {},
    this.methodInfoAddApartmentConfiguration);
  }

  methodInfoDeleteApartmentConfiguration = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_empty_pb.Empty,
    (request: apartment_catalogue_pb.DeleteApartmentConfigurationRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteApartmentConfiguration(
    request: apartment_catalogue_pb.DeleteApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteApartmentConfiguration(
    request: apartment_catalogue_pb.DeleteApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteApartmentConfiguration(
    request: apartment_catalogue_pb.DeleteApartmentConfigurationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/pulsar.apartment.ApartmentCatalogueService/DeleteApartmentConfiguration',
        request,
        metadata || {},
        this.methodInfoDeleteApartmentConfiguration,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/pulsar.apartment.ApartmentCatalogueService/DeleteApartmentConfiguration',
    request,
    metadata || {},
    this.methodInfoDeleteApartmentConfiguration);
  }

}

