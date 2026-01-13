import { CardType } from "./cards";

export type MeasureImageType = {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
  borderRadius: number;
}

export type RootStackParamList = {
  ListCards: undefined;
  SingleCard: { dataCard: CardType, measureImage: MeasureImageType };
};