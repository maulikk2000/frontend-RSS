export interface ICreateLabFeature {
  name: string;
  description: string;
  experimentPageLink?: string; //this is to mention where to go when a card is clicked
  file?: any;
  imagePath: string;
  imageAltText?: string;
  dateCreated?: string;
  dateLastUpdated?: string;
  experimentTags?: Array<string>;
}

export interface ICreateFeatureTag {
  description: string;
}
