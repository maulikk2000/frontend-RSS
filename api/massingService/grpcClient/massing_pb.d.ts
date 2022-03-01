import * as jspb from 'google-protobuf'

import * as google_protobuf_field_mask_pb from 'google-protobuf/google/protobuf/field_mask_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class Point2D extends jspb.Message {
  getX(): number;
  setX(value: number): Point2D;

  getY(): number;
  setY(value: number): Point2D;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Point2D.AsObject;
  static toObject(includeInstance: boolean, msg: Point2D): Point2D.AsObject;
  static serializeBinaryToWriter(message: Point2D, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Point2D;
  static deserializeBinaryFromReader(message: Point2D, reader: jspb.BinaryReader): Point2D;
}

export namespace Point2D {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class MassingConfiguration extends jspb.Message {
  getId(): string;
  setId(value: string): MassingConfiguration;

  getLabel(): string;
  setLabel(value: string): MassingConfiguration;

  getMassingsList(): Array<Massing>;
  setMassingsList(value: Array<Massing>): MassingConfiguration;
  clearMassingsList(): MassingConfiguration;
  addMassings(value?: Massing, index?: number): Massing;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MassingConfiguration.AsObject;
  static toObject(includeInstance: boolean, msg: MassingConfiguration): MassingConfiguration.AsObject;
  static serializeBinaryToWriter(message: MassingConfiguration, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MassingConfiguration;
  static deserializeBinaryFromReader(message: MassingConfiguration, reader: jspb.BinaryReader): MassingConfiguration;
}

export namespace MassingConfiguration {
  export type AsObject = {
    id: string,
    label: string,
    massingsList: Array<Massing.AsObject>,
  }
}

export class Massing extends jspb.Message {
  getId(): string;
  setId(value: string): Massing;

  getLabel(): string;
  setLabel(value: string): Massing;

  getSpine(): SpineMassing | undefined;
  setSpine(value?: SpineMassing): Massing;
  hasSpine(): boolean;
  clearSpine(): Massing;

  getPolygonal(): PolygonalMassing | undefined;
  setPolygonal(value?: PolygonalMassing): Massing;
  hasPolygonal(): boolean;
  clearPolygonal(): Massing;

  getMassingType(): MassingType;
  setMassingType(value: MassingType): Massing;

  getUsageType(): UsageType;
  setUsageType(value: UsageType): Massing;

  getGroupId(): string;
  setGroupId(value: string): Massing;

  getNumberOfFloors(): number;
  setNumberOfFloors(value: number): Massing;

  getFloorHeight(): number;
  setFloorHeight(value: number): Massing;

  getFormCase(): Massing.FormCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Massing.AsObject;
  static toObject(includeInstance: boolean, msg: Massing): Massing.AsObject;
  static serializeBinaryToWriter(message: Massing, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Massing;
  static deserializeBinaryFromReader(message: Massing, reader: jspb.BinaryReader): Massing;
}

export namespace Massing {
  export type AsObject = {
    id: string,
    label: string,
    spine?: SpineMassing.AsObject,
    polygonal?: PolygonalMassing.AsObject,
    massingType: MassingType,
    usageType: UsageType,
    groupId: string,
    numberOfFloors: number,
    floorHeight: number,
  }

  export enum FormCase { 
    FORM_NOT_SET = 0,
    SPINE = 3,
    POLYGONAL = 4,
  }
}

export class SpineMassing extends jspb.Message {
  getPointsList(): Array<Point2D>;
  setPointsList(value: Array<Point2D>): SpineMassing;
  clearPointsList(): SpineMassing;
  addPoints(value?: Point2D, index?: number): Point2D;

  getCorridorWidth(): number;
  setCorridorWidth(value: number): SpineMassing;

  getUnitDepth(): number;
  setUnitDepth(value: number): SpineMassing;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpineMassing.AsObject;
  static toObject(includeInstance: boolean, msg: SpineMassing): SpineMassing.AsObject;
  static serializeBinaryToWriter(message: SpineMassing, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpineMassing;
  static deserializeBinaryFromReader(message: SpineMassing, reader: jspb.BinaryReader): SpineMassing;
}

export namespace SpineMassing {
  export type AsObject = {
    pointsList: Array<Point2D.AsObject>,
    corridorWidth: number,
    unitDepth: number,
  }
}

export class PolygonalMassing extends jspb.Message {
  getBoundariesList(): Array<BoundaryPlane>;
  setBoundariesList(value: Array<BoundaryPlane>): PolygonalMassing;
  clearBoundariesList(): PolygonalMassing;
  addBoundaries(value?: BoundaryPlane, index?: number): BoundaryPlane;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolygonalMassing.AsObject;
  static toObject(includeInstance: boolean, msg: PolygonalMassing): PolygonalMassing.AsObject;
  static serializeBinaryToWriter(message: PolygonalMassing, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolygonalMassing;
  static deserializeBinaryFromReader(message: PolygonalMassing, reader: jspb.BinaryReader): PolygonalMassing;
}

export namespace PolygonalMassing {
  export type AsObject = {
    boundariesList: Array<BoundaryPlane.AsObject>,
  }
}

export class BoundaryPlane extends jspb.Message {
  getBoundaryList(): Array<Point2D>;
  setBoundaryList(value: Array<Point2D>): BoundaryPlane;
  clearBoundaryList(): BoundaryPlane;
  addBoundary(value?: Point2D, index?: number): Point2D;

  getZOffset(): number;
  setZOffset(value: number): BoundaryPlane;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoundaryPlane.AsObject;
  static toObject(includeInstance: boolean, msg: BoundaryPlane): BoundaryPlane.AsObject;
  static serializeBinaryToWriter(message: BoundaryPlane, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoundaryPlane;
  static deserializeBinaryFromReader(message: BoundaryPlane, reader: jspb.BinaryReader): BoundaryPlane;
}

export namespace BoundaryPlane {
  export type AsObject = {
    boundaryList: Array<Point2D.AsObject>,
    zOffset: number,
  }
}

export class CreateMassingConfigurationRequest extends jspb.Message {
  getConfiguration(): MassingConfiguration | undefined;
  setConfiguration(value?: MassingConfiguration): CreateMassingConfigurationRequest;
  hasConfiguration(): boolean;
  clearConfiguration(): CreateMassingConfigurationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateMassingConfigurationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateMassingConfigurationRequest): CreateMassingConfigurationRequest.AsObject;
  static serializeBinaryToWriter(message: CreateMassingConfigurationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateMassingConfigurationRequest;
  static deserializeBinaryFromReader(message: CreateMassingConfigurationRequest, reader: jspb.BinaryReader): CreateMassingConfigurationRequest;
}

export namespace CreateMassingConfigurationRequest {
  export type AsObject = {
    configuration?: MassingConfiguration.AsObject,
  }
}

export class GetMassingConfigurationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetMassingConfigurationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMassingConfigurationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMassingConfigurationRequest): GetMassingConfigurationRequest.AsObject;
  static serializeBinaryToWriter(message: GetMassingConfigurationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMassingConfigurationRequest;
  static deserializeBinaryFromReader(message: GetMassingConfigurationRequest, reader: jspb.BinaryReader): GetMassingConfigurationRequest;
}

export namespace GetMassingConfigurationRequest {
  export type AsObject = {
    id: string,
  }
}

export class UpdateMassingConfigurationRequest extends jspb.Message {
  getConfiguration(): MassingConfiguration | undefined;
  setConfiguration(value?: MassingConfiguration): UpdateMassingConfigurationRequest;
  hasConfiguration(): boolean;
  clearConfiguration(): UpdateMassingConfigurationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMassingConfigurationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMassingConfigurationRequest): UpdateMassingConfigurationRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMassingConfigurationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMassingConfigurationRequest;
  static deserializeBinaryFromReader(message: UpdateMassingConfigurationRequest, reader: jspb.BinaryReader): UpdateMassingConfigurationRequest;
}

export namespace UpdateMassingConfigurationRequest {
  export type AsObject = {
    configuration?: MassingConfiguration.AsObject,
  }
}

export class DeleteMassingConfigurationRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteMassingConfigurationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteMassingConfigurationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteMassingConfigurationRequest): DeleteMassingConfigurationRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteMassingConfigurationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteMassingConfigurationRequest;
  static deserializeBinaryFromReader(message: DeleteMassingConfigurationRequest, reader: jspb.BinaryReader): DeleteMassingConfigurationRequest;
}

export namespace DeleteMassingConfigurationRequest {
  export type AsObject = {
    id: string,
  }
}

export class ListMassingConfigurationsRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): ListMassingConfigurationsRequest;

  getPageToken(): string;
  setPageToken(value: string): ListMassingConfigurationsRequest;

  getPageSizeCase(): ListMassingConfigurationsRequest.PageSizeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListMassingConfigurationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListMassingConfigurationsRequest): ListMassingConfigurationsRequest.AsObject;
  static serializeBinaryToWriter(message: ListMassingConfigurationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListMassingConfigurationsRequest;
  static deserializeBinaryFromReader(message: ListMassingConfigurationsRequest, reader: jspb.BinaryReader): ListMassingConfigurationsRequest;
}

export namespace ListMassingConfigurationsRequest {
  export type AsObject = {
    pageSize: number,
    pageToken: string,
  }

  export enum PageSizeCase { 
    _PAGE_SIZE_NOT_SET = 0,
    PAGE_SIZE = 1,
  }
}

export class ListMassingConfigurationsResponse extends jspb.Message {
  getConfigurationsList(): Array<MassingConfiguration>;
  setConfigurationsList(value: Array<MassingConfiguration>): ListMassingConfigurationsResponse;
  clearConfigurationsList(): ListMassingConfigurationsResponse;
  addConfigurations(value?: MassingConfiguration, index?: number): MassingConfiguration;

  getNextPageToken(): string;
  setNextPageToken(value: string): ListMassingConfigurationsResponse;

  getNextPageTokenCase(): ListMassingConfigurationsResponse.NextPageTokenCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListMassingConfigurationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListMassingConfigurationsResponse): ListMassingConfigurationsResponse.AsObject;
  static serializeBinaryToWriter(message: ListMassingConfigurationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListMassingConfigurationsResponse;
  static deserializeBinaryFromReader(message: ListMassingConfigurationsResponse, reader: jspb.BinaryReader): ListMassingConfigurationsResponse;
}

export namespace ListMassingConfigurationsResponse {
  export type AsObject = {
    configurationsList: Array<MassingConfiguration.AsObject>,
    nextPageToken: string,
  }

  export enum NextPageTokenCase { 
    _NEXT_PAGE_TOKEN_NOT_SET = 0,
    NEXT_PAGE_TOKEN = 2,
  }
}

export class CreateMassingRequest extends jspb.Message {
  getMassingConfigurationId(): string;
  setMassingConfigurationId(value: string): CreateMassingRequest;

  getMassing(): Massing | undefined;
  setMassing(value?: Massing): CreateMassingRequest;
  hasMassing(): boolean;
  clearMassing(): CreateMassingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateMassingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateMassingRequest): CreateMassingRequest.AsObject;
  static serializeBinaryToWriter(message: CreateMassingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateMassingRequest;
  static deserializeBinaryFromReader(message: CreateMassingRequest, reader: jspb.BinaryReader): CreateMassingRequest;
}

export namespace CreateMassingRequest {
  export type AsObject = {
    massingConfigurationId: string,
    massing?: Massing.AsObject,
  }
}

export class UpdateMassingRequest extends jspb.Message {
  getMassing(): Massing | undefined;
  setMassing(value?: Massing): UpdateMassingRequest;
  hasMassing(): boolean;
  clearMassing(): UpdateMassingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMassingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMassingRequest): UpdateMassingRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMassingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMassingRequest;
  static deserializeBinaryFromReader(message: UpdateMassingRequest, reader: jspb.BinaryReader): UpdateMassingRequest;
}

export namespace UpdateMassingRequest {
  export type AsObject = {
    massing?: Massing.AsObject,
  }
}

export class DeleteMassingRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteMassingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteMassingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteMassingRequest): DeleteMassingRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteMassingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteMassingRequest;
  static deserializeBinaryFromReader(message: DeleteMassingRequest, reader: jspb.BinaryReader): DeleteMassingRequest;
}

export namespace DeleteMassingRequest {
  export type AsObject = {
    id: string,
  }
}

export enum MassingType { 
  MASSING_TYPE_UNDEFINED = 0,
  TOWER = 1,
  PODIUM = 2,
  BASEMENT = 3,
}
export enum UsageType { 
  USAGE_TYPE_UNDEFINED = 0,
  RESIDENTIAL = 1,
  COMMERCIAL = 2,
  RETAIL = 3,
  COMMUNITY = 4,
  PARKING = 5,
  STORAGE = 6,
  BACK_OF_HOUSE = 7,
}
