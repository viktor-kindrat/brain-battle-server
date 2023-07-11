let testingModel = require("../Database/Schema/Test");
let userModel = require("../Database/Schema/User")

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
                            questionId: -1,
                            testIdInUser: data.testId
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

    async checkIfExist(req, res) {
        try {
            let code = req.body.code;
            let testing = await testingModel.findOne({ code: code });
            if (testing) {
                res.json({ status: "ok", data: true })
            } else {
                res.json({ status: "ok", data: false })
            }
        } catch (e) {
            res.json({ status: "error" })
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
            console.log(testing)
            if (testing.code) {
                const theSameUser = [...testing.respondents].filter(respondent => respondent.name === data.name);
                if (theSameUser.length !== 0) {
                    testing.respondents = await [...testing.respondents].filter(resp => resp.name !== data.name)
                    testing.save()
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
            console.log(e)
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
                const userExist = [...testing.respondents].filter(resp => resp.name === data.name);

                if (userExist) {
                    console.log(userExist);
                    const questionIndex = parseInt(testing.questionId);
                    const variant = testing.questions[0][questionIndex].variants[data.answerId];

                    let newResps = await testing.respondents.map(item => {
                        if (item.name === data.name) {
                            console.log("found");
                            let answers = [...item.answers];

                            if (answers.length === 0) {
                                answers = Array(testing.questions[0].length).fill(""); // Initialize answers array with null values
                            }

                            answers[questionIndex] = variant.right ? "true" : "false";

                            return { ...item, answers: answers };
                        }
                        return item;
                    });

                    console.log(newResps);
                    testing.respondents = await newResps;

                    await testing.save()
                        .then((e) => {
                            console.log(e)
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

    async getQuestionsCount(req, res) {
        try {
            const data = req.body;
            const testing = await testingModel.findOne({ code: data.code });

            if (testing) {
                const userExist = [...testing.respondents].filter(resp => resp.name === data.name);

                if (userExist) {
                    res.json({ status: "ok", data: testing.questions[0][testing.questionId].variants.length })
                } else {
                    res.json({ status: "user with the same username does not exist" });
                }
            } else {
                res.json({ status: "Testing does not exist" });
            }
        } catch (e) {
            console.log(e);
            res.json({ status: "error" });
        }
    }

    async removeTest(req, res) {
        try {
            let id = req.jwtResult.id;
            let data = req.body;
            if (id && data.code) {
                let test = await testingModel.findOne({code: data.code});
                if (test.code) {
                    let user = await userModel.findOne({_id: id});
                    if (user.name) {
                        console.log(test)
                        let newTests = await [...user.tests].map(item=>item.id === test.testIdInUser ? {...item, testings: [...item.testings, {
                            respondents: test.respondents
                        }]} : item);
                        console.log(newTests)
                        user.tests = await newTests;
                        await user.save();
                        await testingModel.deleteOne({code: data.code})
                        res.json({status: "ok"})
                    } else {
                        res.json({status: "User does not exist"})
                    }
                } else {
                    res.json({status: "Testing does not exist"})
                }
            } else {
                res.json({status: "Missing data"})
            }
        } catch (e) {
            console.log(e)
            res.json({ status: "error" });
        }
    }

    async getResult(req, res) {
        try {
            const data = req.body;
            const testing = await testingModel.findOne({ code: data.code });

            if (testing) {
                const userExist = [...testing.respondents].filter(resp => resp.name === data.name);

                if (userExist) {
                    let resps = await [...testing.respondents].sort((a, b) => b.answers.reduce((accumulator, item) => item === "true" ? accumulator + 1 : accumulator, 0) - a.answers.reduce((accumulator, item) => item === "true" ? accumulator + 1 : accumulator, 0));
                    let place = await [...resps].map((item, index) => (item.name === data.name) ? index : false).filter(item => item !== false)[0] + 1;
                    console.log("USER", userExist)
                    let score = await userExist[0].answers.reduce((accumulator, item) => item === "true" ? accumulator + 1 : accumulator, 0);
                    console.log({ place: place, score: score })
                    res.json({ status: "ok", data: { place: place, score: score } })
                } else {
                    res.json({ status: "user with the same username does not exist" });
                }
            } else {
                res.json({ status: "Testing does not exist" });
            }
        } catch (e) {
            console.log(e);
            res.json({ status: "error" });
        }
    }

}

module.exports = new Controller()