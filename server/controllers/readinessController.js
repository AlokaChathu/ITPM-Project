import Readiness from "../models/Readiness.model.js";

// [STUDENT] Submit CV and Academic details
export const submitReadinessDetails = async (req, res) => {
    const { cvUrl, academicPerformance } = req.body;
    const studentId = req.userId; // Extracted from userAuth middleware

    try {
        let readiness = await Readiness.findOne({ studentId });

        if (readiness) {
            // Update existing record
            readiness.cvUrl = cvUrl || readiness.cvUrl;
            readiness.academicPerformance = academicPerformance || readiness.academicPerformance;
            readiness.status = 'In Review';
            await readiness.save();
            return res.json({ success: true, message: "Details updated successfully", data: readiness });
        } else {
            // Create new record
            readiness = new Readiness({
                studentId,
                cvUrl,
                academicPerformance,
                status: 'In Review'
            });
            await readiness.save();
            return res.json({ success: true, message: "Details submitted successfully", data: readiness });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [STUDENT/ADMIN] Get a specific student's readiness data
export const getStudentReadiness = async (req, res) => {
    // If student calls this, use their own token ID. If Admin calls it, use the URL parameter.
    const studentId = req.params.studentId || req.userId;

    try {
        const readiness = await Readiness.findOne({ studentId }).populate('studentId', 'name email phone age');
        if (!readiness) {
            return res.json({ success: false, message: "No readiness profile found for this student" });
        }
        res.json({ success: true, data: readiness });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] Get all readiness evaluations to track progress
export const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Readiness.find().populate('studentId', 'name email age phone');
        res.json({ success: true, data: evaluations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] Update skill gaps, courses, interview notes, and approve eligibility
export const evaluateStudent = async (req, res) => {
    const { studentId } = req.params;
    const { skillGaps, suggestedCourses, interviewNotes, status, isEligible } = req.body;

    try {
        const readiness = await Readiness.findOne({ studentId });
        if (!readiness) {
            return res.json({ success: false, message: "Readiness profile not found for this student. They need to submit their CV first." });
        }

        // Only update fields that the admin passed in the request
        if (skillGaps) readiness.skillGaps = skillGaps;
        if (suggestedCourses) readiness.suggestedCourses = suggestedCourses;
        if (interviewNotes) readiness.interviewNotes = interviewNotes;
        if (status) readiness.status = status;
        if (typeof isEligible === 'boolean') readiness.isEligible = isEligible;

        await readiness.save();
        res.json({ success: true, message: "Evaluation updated successfully", data: readiness });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};