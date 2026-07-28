const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/applications.json");

// Read JSON file
function readApplications(callback) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return callback(err);

        try {
            const applications = JSON.parse(data || "[]");
            callback(null, applications);
        } catch (error) {
            callback(error);
        }
    });
}

// Write JSON file
function writeApplications(applications, callback) {
    fs.writeFile(
        filePath,
        JSON.stringify(applications, null, 2),
        callback
    );
}

// GET all applications
function getApplications(req, res) {
    readApplications((err, applications) => {
        if (err) {
            return res.status(500).json({
                message: "Unable to read data."
            });
        }

        res.status(200).json(applications);
    });
}

// CREATE application
function createApplication(req, res) {
    readApplications((err, applications) => {
        if (err) {
            return res.status(500).json({
                message: "Unable to read data."
            });
        }

        const newApplication = {
            id: Date.now(),
            ...req.body
        };

        applications.push(newApplication);

        writeApplications(applications, (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Unable to save data."
                });
            }

            res.status(201).json({
                message: "Application added successfully!",
                application: newApplication
            });
        });
    });
}

// UPDATE application
function updateApplication(req, res) {
    readApplications((err, applications) => {
        if (err) {
            return res.status(500).json({
                message: "Unable to read data."
            });
        }

        const id = Number(req.params.id);

        const index = applications.findIndex(app => app.id === id);

        if (index === -1) {
            return res.status(404).json({
                message: "Application not found."
            });
        }

        applications[index] = {
            ...applications[index],
            ...req.body
        };

        writeApplications(applications, (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Unable to update application."
                });
            }

            res.json({
                message: "Application updated successfully!",
                application: applications[index]
            });
        });
    });
}

// DELETE application
function deleteApplication(req, res) {
    readApplications((err, applications) => {
        if (err) {
            return res.status(500).json({
                message: "Unable to read data."
            });
        }

        const id = Number(req.params.id);

        const index = applications.findIndex(app => app.id === id);

        if (index === -1) {
            return res.status(404).json({
                message: "Application not found."
            });
        }

        const deletedApplication = applications.splice(index, 1);

        writeApplications(applications, (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Unable to delete application."
                });
            }

            res.json({
                message: "Application deleted successfully!",
                application: deletedApplication[0]
            });
        });
    });
}

module.exports = {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication
};