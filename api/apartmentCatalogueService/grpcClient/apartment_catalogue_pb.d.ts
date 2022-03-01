import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as apartment_pb from './apartment_pb';


export class GetApartmentCatalogueRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetApartmentCatalogueRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetApartmentCatalogueRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetApartmentCatalogueRequest): GetApartmentCatalogueRequest.AsObject;
  static serializeBinaryToWriter(message: GetApartmentCatalogueRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetApartmentCatalogueRequest;
  static deserializeBinaryFromReader(message: GetApartmentCatalogueRequest, reader: jspb.BinaryReader): GetApartmentCatalogueRequest;
}

export namespace GetApartmentCatalogueRequest {
  export type AsObject = {
    id: string,
  }
}

export class ApartmentCatalogue extends jspb.Message {
  getId(): string;
  setId(value: string): ApartmentCatalogue;

  getApartmentConfigurationsList(): Array<apartment_pb.ApartmentConfiguration>;
  setApartmentConfigurationsList(value: Array<apartment_pb.ApartmentConfiguration>): ApartmentCatalogue;
  clearApartmentConfigurationsList(): ApartmentCatalogue;
  addApartmentConfigurations(value?: apartment_pb.ApartmentConfiguration, index?: number): apartment_pb.ApartmentConfiguration;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApartmentCatalogue.AsObject;
  static toObject(includeInstance: boolean, msg: ApartmentCatalogue): ApartmentCatalogue.AsObject;
  static serializeBinaryToWriter(message: ApartmentCatalogue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApartmentCatalogue;
  static deserializeBinaryFromReader(message: ApartmentCatalogue, reader: jspb.BinaryReader): ApartmentCatalogue;
}

export namespace ApartmentCatalogue {
  export type AsObject = {
    id: string,
    apartmentConfigurationsList: Array<apartment_pb.ApartmentConfiguration.AsObject>,
  }
}

export class CreateApartmentCatalogueRequest extends jspb.Message {
  getApartmentConfigurationsList(): Array<apartment_pb.ApartmentConfiguration>;
  setApartmentConfigurationsList(value: Array<apartment_pb.ApartmentConfiguration>): CreateApartmentCatalogueRequest;
  clearApartmentConfigurationsList(): CreateApartmentCatalogueRequest;
  addApartmentConfigurations(value?: apartment_pb.ApartmentConfiguration, index?: number): apartment_pb.ApartmentConfiguration;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateApartmentCatalogueRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateApartmentCatalogueRequest): CreateApartmentCatalogueRequest.AsObject;
  static serializeBinaryToWriter(message: CreateApartmentCatalogueRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateApartmentCatalogueRequest;
  static deserializeBinaryFromReader(message: CreateApartmentCatalogueRequest, reader: jspb.BinaryReader): CreateApartmentCatalogueRequest;
}

export namespace CreateApartmentCatalogueRequest {
  export type AsObject = {
    apartmentConfigurationsList: Array<apartment_pb.ApartmentConfiguration.AsObject>,
  }
}

export class UpdateApartmentConfigurationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateApartmentConfigurationRequest;

  getApartmentConfiguration(): apartment_pb.ApartmentConfiguration | undefined;
  setApartmentConfiguration(value?: apartment_pb.ApartmentConfiguration): UpdateApartmentConfigurationRequest;
  hasApartmentConfiguration(): boolean;
  clearApartmentConfiguration(): UpdateApartmentConfigurationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateApartmentConfigurationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateApartmentConfigurationRequest): UpdateApartmentConfigurationRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateApartmentConfigurationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateApartmentConfigurationRequest;
  static deserializeBinaryFromReader(message: UpdateApartmentConfigurationRequest, reader: jspb.BinaryReader): UpdateApartmentConfigurationRequest;
}

export namespace UpdateApartmentConfigurationRequest {
  export type AsObject = {
    id: string,
    apartmentConfiguration?: apartment_pb.ApartmentConfiguration.AsObject,
  }
}

export class AddApartmentConfigurationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): AddApartmentConfigurationRequest;

  getApartmentConfiguration(): apartment_pb.ApartmentConfiguration | undefined;
  setApartmentConfiguration(value?: apartment_pb.ApartmentConfiguration): AddApartmentConfigurationRequest;
  hasApartmentConfiguration(): boolean;
  clearApartmentConfiguration(): AddApartmentConfigurationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddApartmentConfigurationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddApartmentConfigurationRequest): AddApartmentConfigurationRequest.AsObject;
  static serializeBinaryToWriter(message: AddApartmentConfigurationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddApartmentConfigurationRequest;
  static deserializeBinaryFromReader(message: AddApartmentConfigurationRequest, reader: jspb.BinaryReader): AddApartmentConfigurationRequest;
}

export namespace AddApartmentConfigurationRequest {
  export type AsObject = {
    id: string,
    apartmentConfiguration?: apartment_pb.ApartmentConfiguration.AsObject,
  }
}

export class DeleteApartmentConfigurationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteApartmentConfigurationRequest;

  getApartmentConfigurationId(): string;
  setApartmentConfigurationId(value: string): DeleteApartmentConfigurationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteApartmentConfigurationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteApartmentConfigurationRequest): DeleteApartmentConfigurationRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteApartmentConfigurationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteApartmentConfigurationRequest;
  static deserializeBinaryFromReader(message: DeleteApartmentConfigurationRequest, reader: jspb.BinaryReader): DeleteApartmentConfigurationRequest;
}

export namespace DeleteApartmentConfigurationRequest {
  export type AsObject = {
    id: string,
    apartmentConfigurationId: string,
  }
}

