import Readiness from "../models/Readiness.model.js";

// [STUDENT] Submit CV and Academic details
export const submitReadinessDetails = async (req, res) => {
    try {
        const { cvUrl, academicPerformance, year, semester, currentGpa, otherSkills, academicAchievements, studentId } = req.body;
        
        // Prioritize the secure token ID, but fallback to the body ID if needed
        const idToUse = req.userId || studentId;

        if (!idToUse) {
            return res.json({ success: false, message: "Authentication Error: Missing User ID." });
        }

        let readiness = await Readiness.findOne({ studentId: idToUse });

        if (readiness) {
            // Safely update (allows students to clear out their academic performance text)
            if (cvUrl !== undefined) readiness.cvUrl = cvUrl;
            if (academicPerformance !== undefined) readiness.academicPerformance = academicPerformance;
            if (year !== undefined) readiness.year = year;
            if (semester !== undefined) readiness.semester = semester;
            if (currentGpa !== undefined) readiness.currentGpa = currentGpa;
            if (otherSkills !== undefined) readiness.otherSkills = otherSkills;
            if (academicAchievements !== undefined) readiness.academicAchievements = academicAchievements;
            
            // Anytime a student updates their CV, push them back to "In Review"
            readiness.status = 'In Review'; 
            await readiness.save();
            return res.json({ success: true, message: "Details updated successfully", data: readiness });
        } else {
            // Create new record
            readiness = new Readiness({
                studentId: idToUse,
                cvUrl,
                academicPerformance,
                year,
                semester,
                currentGpa,
                otherSkills,
                academicAchievements,
                status: 'In Review'
            });
            await readiness.save();
            return res.json({ success: true, message: "Details submitted successfully", data: readiness });
        }
    } catch (error) {
        console.error("Error in submitReadinessDetails:", error);
        res.json({ success: false, message: error.message });
    }
};

// [STUDENT/ADMIN] Get a specific student's readiness data
export const getStudentReadiness = async (req, res) => {
    const studentId = req.params.studentId || req.userId;
    try {
        const readiness = await Readiness.findOne({ studentId }).populate('studentId', 'name email phone age');
        if (!readiness) {
            return res.json({ success: false, message: "No readiness profile found." });
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
            return res.json({ success: false, message: "Readiness profile not found." });
        }

        // Safely update fields (Allows admin to delete notes or empty the courses array)
        if (skillGaps !== undefined) readiness.skillGaps = skillGaps;
        if (suggestedCourses !== undefined) readiness.suggestedCourses = suggestedCourses;
        if (interviewNotes !== undefined) readiness.interviewNotes = interviewNotes;
        if (status !== undefined) readiness.status = status;
        if (isEligible !== undefined) readiness.isEligible = isEligible;

        await readiness.save();
        res.json({ success: true, message: "Evaluation updated successfully", data: readiness });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [COMPANY] Get full student details including personal and academic information
export const getStudentFullDetails = async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const readiness = await Readiness.findOne({ studentId }).populate('studentId', 'name email age');
        
        if (!readiness) {
            return res.json({ success: false, message: "Student profile not found." });
        }
        
        res.json({ success: true, data: readiness });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};