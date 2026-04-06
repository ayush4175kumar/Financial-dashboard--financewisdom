const FinancialRecord = require('../models/FinancialRecord');

exports.createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    if (!amount || !type || !category || !date) return res.status(400).json({ message: 'Missing required fields' });
    const record = await FinancialRecord.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id
    });
    res.status(201).json(record);
  } catch (err) { next(err); }
};

exports.getRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
    const records = await FinancialRecord.find(filter).populate('createdBy', 'username role');
    res.json(records);
  } catch (err) { next(err); }
};

exports.getRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findById(req.params.id).populate('createdBy', 'username role');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) { next(err); }
};

exports.updateRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    const record = await FinancialRecord.findByIdAndUpdate(
      req.params.id,
      { amount, type, category, date, notes },
      { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) { next(err); }
};

exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) { next(err); }
};
