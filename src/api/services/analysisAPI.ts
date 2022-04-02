import axios from '@api/axiosInstance';
import { ItemType, RankingType } from '@utils/optionUtils';

export const toDoListAPI = () => axios.get(`analysis/to_do_list/`);

export const statisticsAPI = (fromDate: string, toDate: string) =>
  axios.get(`analysis/statistics/?from_date=${fromDate}&to_date=${toDate}`);

export interface ItemRankingAPIProps {
  itemType: ItemType;
  rankingType: RankingType;
  fromDate: string;
  toDate: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export const itemRankingAPI = (props: ItemRankingAPIProps) =>
  axios.get(
    `item/${props.itemType}/ranking/${props.rankingType}/?from_date=${
      props.fromDate
    }&to_date=${props.toDate}${
      props.category ? `&category=${props.category}` : ''
    }${props.limit ? `&limit=${props.limit}` : ''}${
      props.offset ? `&offset=${props.offset}` : ''
    }`
  );
