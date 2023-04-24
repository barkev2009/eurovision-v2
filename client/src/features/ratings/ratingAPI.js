import { $host } from "../http";


export const getRatingsByContestAPI = async ({ userId, year, contest_step }) => {
    const { data } = await $host.get('api/rating/by_user_contest', { params: { userId, year, contest_step } });
    return data;
}

export const editRatingAPI = async ({ id, purity, show, difficulty, originality, sympathy }) => {
    const { data } = await $host.put('api/rating/' + id, { purity, show, difficulty, originality, sympathy });
    return data;
}