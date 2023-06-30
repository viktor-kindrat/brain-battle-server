let testingModel = require("../Database/Schema/Test");
let userModel = require("../Database/Schema/User")

// const TestSchema = new Schema({
//     code: {type: String, required: true, unique: true},
//     questions: {type: Array, required: true},
//     initiatorId: {type: String, required: true},
//     respondents: {type: Array},
//     questionId: {type: String}
// })

class Controller {
    async createTest(req, res) {
        const userId = req.jwtResult.id;
        const data = req.body;
        if (userId) {
            try {
                let findUser = await userModel.findOne({ _id: userId });
                if (Object.keys(findUser).length !== 0) {
                    const neededTest = await findUser.tests.filter(test => test.id === data.testId);
                    if (neededTest.length === 1) {
                        const testing = await new testingModel({
                            code: data.code,
                            questions: [neededTest[0].questions],
                            initiatorId: userId,
                            respondents: [],
                            questionId: 0
                        })
                        await testing.save();
                        res.json({ status: "ok" })
                    } else {
                        res.json({ status: "Critical error. Contact me on telegram @mexicancat228" })
                    }
                } else {
                    res.json({ status: "error" })
                }
            }
            catch (e) {
                console.log(e)
                res.json({ status: "error" })
            }
        } else {
            res.json({ status: "error. token is not provided" })
        }
    }

    async addRespondent(req, res) {
        try {
            const data = req.body;
            const testing = await testingModel.findOne({ code: data.code })
            if (Object.keys(testing).length > 0) {
                const theSameUser = testing.respondents.filter(respondent => respondent.name === data.name);
                if (theSameUser.length === 0) {
                    await testing.respondents.push({
                        name: data.name,
                        answers: [],
                    })
                    testing.save();
                    res.json({ status: "ok" })
                } else {
                    res.json({ status: "user with the same username already exist" })
                }
            } else {
                res.json({ status: "Testing does not exist" })
            }
        } catch (e) {
            res.json({ status: "error" })
        }
    }
    async removeRespondent(req, res) {
        try {
            const data = req.body;
            const testing = await testingModel.findOne({ code: data.code })
            if (Object.keys(testing).length > 0) {
                const theSameUser = testing.respondents.filter(respondent => respondent.name === data.name);
                if (theSameUser.length !== 0) {
                    testing.respondents = await testing.respondents.filter(resp => resp.name !== data.name)
                    testing.save();
                    res.json({ status: "ok" })
                } else {
                    res.json({ status: "user with the same username does not exist" })
                }
            } else {
                res.json({ status: "Testing does not exist" })
            }
        } catch (e) {
            res.json({ status: "error" })
        }
    }

    async getFullTestingData(req, res) {
        try {
            const id = req.jwtResult.id;
            const data = req.body;
            const testing = await testingModel.findOne({ code: data.code });
            if (Object.keys(testing).length > 0) {
                if (testing.initiatorId === id) {
                    res.json({ status: "ok", data: testing })
                } else {
                    res.json({ status: "You are not initiator. Permission denied" })
                }
            } else {
                res.json({ status: "Testing does not exist" })
            }
        } catch (e) {
            res.json({ status: "error" })
        }
    }

    async switchQuestion(req, res) {
        try {
            const id = req.jwtResult.id;
            const data = req.body;
            const testing = await testingModel.findOne({ code: data.code });
            if (Object.keys(testing).length > 0) {
                if (testing.initiatorId === id) {
                    testing.questionId = await parseInt(testing.questionId) + 1;
                    testing.save()
                    res.json({ status: "ok" })
                } else {
                    res.json({ status: "You are not initiator. Permission denied" })
                }
            } else {
                res.json({ status: "Testing does not exist" })
            }
        } catch (e) {
            res.json({ status: "error" })
        }
    }

    async setAnswer(req, res) {
        try {
            const data = req.body;
            const testing = await testingModel.findOne({ code: data.code });

            if (testing) {
                const userExist = testing.respondents.find(resp => resp.name === data.name);

                if (userExist) {
                    console.log(userExist);
                    const questionIndex = parseInt(testing.questionId);
                    const variant = testing.questions[0][questionIndex].variants[data.answerId];

                    let newResps = testing.respondents.map(item => {
                        if (item.name === data.name) {
                            console.log("found");
                            let answers = item.answers;

                            if (answers.length === 0) {
                                answers = Array(testing.questions[0].length).fill(null); // Initialize answers array with null values
                            }

                            answers[questionIndex] = variant.right ? "true" : "false";

                            return { ...item, answers: answers };
                        }
                        return item;
                    });

                    console.log(newResps);
                    testing.respondents = newResps;

                    testing.save()
                        .then(() => {
                            res.json({ status: "ok" });
                        })
                        .catch(error => {
                            console.log(error);
                            res.json({ status: "error" });
                        });
                } else {
                    res.json({ status: "user with the same username does not exist" });
                }
            } else {
                res.json({ status: "Testing does not exist" });
            }
        } catch (error) {
            console.log(error);
            res.json({ status: "error" });
        }
    }

}

module.exports = new Controller()