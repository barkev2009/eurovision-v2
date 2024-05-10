import { $authHost } from "../http";


export const createRecordsAPI = async ({ parsedData }) => {
    const { data } = await $authHost.post('api/admin/createRecords', { parsedData });
    // console.log(data);
    return data;
}