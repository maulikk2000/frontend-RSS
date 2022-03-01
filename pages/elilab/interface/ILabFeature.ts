export interface IFeatureTag {
  description: string;
  hexColour: string;
}

export interface ILabFeature {
  name?: string;
  description?: string;
  experimentPageLink?: string; //this is to mention where to go when a card is clicked
  imagePath?: string;
  imageAltText?: string;
  dateCreated?: string;
  dateLastUpdated?: string;
  tagDetails?: Array<IFeatureTag>;
}
