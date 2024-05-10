const { Contestant, Entry, User, Rating } = require("../models/models");
const { createContestantRating } = require("../utils/createContestantRating");

class AdminController {
    async createRecords(req, res, next) {
        try {
            const { parsedData } = req.body;
            let data;
            // console.log(parsedData);
            for (let i = 0; i < parsedData.length; i++) {
                data = parsedData[i];
                if (data.COUNTRY) {
                    await createContestantRating(
                        data.COUNTRY.trim(),
                        data.ARTIST.trim(),
                        data.SONG.trim(),
                        Number(data.YEAR.trim()),
                        Number(data.ORDER.trim()),
                        data.CONTEST_STEP.trim(),
                        Number(data.PLACE.trim())
                    );
                }
            }
            return res.status(200).json({message: 'OK'})
        } catch (error) {
            return res.json({message: error.message})
        }
    }
}

module.exports = new AdminController();