import { $authHost } from "../http";


export const getRatingsByContestAPI = async ({ year, contest_step }) => {
    const { data } = await $authHost.get('api/rating/by_user_contest', { params: { year, contest_step } });
    // console.log(data.map(item => item.entry.contestant.country));
    return data;
}

export const searchAPI = async ({ q }) => {
    const { data } = await $authHost.get('api/rating/search', { params: { q } });
    return data;
}

export const editRatingAPI = async ({ id, purity, show, difficulty, originality, sympathy }) => {
    const { data } = await $authHost.put('api/rating/' + id, { purity, show, difficulty, originality, sympathy });
    return data;
}

export const editQualifierAPI = async ({ id, qualifier }) => {
    const { data } = await $authHost.put('api/contestant/' + id, { qualifier });
    return data;
}

export const editPlaceAPI = async ({ id, place_in_final }) => {
    const { data } = await $authHost.put('api/contestant/' + id, { place_in_final });
    return data;
}