import mongoose from 'mongoose';
import reportModel from '../models/reportModel.js';

const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

export const uploadReport = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { studentId, studentName, studentEmail, internshipTitle, company } = req.body;

    console.log('Bucket available:', !!bucket);

    // Check if student already has a report
    const existingReport = await reportModel.findOne({ studentId });
    if (existingReport) {
      console.log('Deleting existing report:', existingReport._id);
      // Delete old file from GridFS
      await bucket.delete(existingReport.fileId);
      // Delete old report document
      await reportModel.deleteOne({ studentId });
    }

    // Upload to GridFS using Promise
    console.log('Starting GridFS upload');
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    uploadStream.end(req.file.buffer);

    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    console.log('GridFS upload complete. File ID:', uploadStream.id);
    console.log('File length:', uploadStream.length);

    // Create new report document
    const report = await reportModel.create({
      studentId,
      studentName,
      studentEmail,
      internshipTitle,
      company,
      fileId: uploadStream.id,
      fileName: req.file.originalname,
      fileSize: uploadStream.length || req.file.size,
      status: 'Pending Review'
    });

    console.log('Report document created:', report);
    res.json({ success: true, message: 'Report uploaded successfully', data: report });
  } catch (error) {
    console.error('Error uploading report:', error);
    res.status(500).json({ success: false, message: 'Failed to upload report' });
  }
};

export const updateReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { id } = req.params;

    // Find existing report
    const existingReport = await reportModel.findById(id);
    if (!existingReport) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Delete old file from GridFS
    await bucket.delete(existingReport.fileId);

    // Upload new file to GridFS using Promise
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    uploadStream.end(req.file.buffer);

    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    // Update report with new file
    existingReport.fileId = uploadStream.id;
    existingReport.fileName = req.file.originalname;
    existingReport.fileSize = uploadStream.length || req.file.size;
    existingReport.status = 'Pending Review';
    existingReport.mark = null;
    existingReport.feedback = '';
    await existingReport.save();

    res.json({ success: true, message: 'Report updated successfully', data: existingReport });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ success: false, message: 'Failed to update report' });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Find report
    const report = await reportModel.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Delete file from GridFS
    await bucket.delete(report.fileId);

    // Delete report document
    await reportModel.deleteOne({ _id: id });

    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ success: false, message: 'Failed to delete report' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await reportModel.find().sort({ submittedDate: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

export const getStudentReport = async (req, res) => {
  try {
    const studentId = req.userId;
    const report = await reportModel.findOne({ studentId });
    
    if (!report) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching student report:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report' });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Find report
    const report = await reportModel.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Set headers
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="${report.fileName}"`);

    // Stream file from GridFS
    const downloadStream = bucket.openDownloadStream(report.fileId);
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('GridFS download error:', error);
      res.status(500).json({ success: false, message: 'Failed to download file' });
    });
  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json({ success: false, message: 'Failed to download report' });
  }
};

export const updateReportGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { mark, feedback, status } = req.body;

    const report = await reportModel.findByIdAndUpdate(
      id,
      { mark, feedback, status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, message: 'Report grade updated', data: report });
  } catch (error) {
    console.error('Error updating report grade:', error);
    res.status(500).json({ success: false, message: 'Failed to update grade' });
  }
};
