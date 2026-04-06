const FinancialRecord = require('../models/FinancialRecord');

exports.summary = async (req, res, next) => {
  try {
    const [income, expense] = await Promise.all([
      FinancialRecord.aggregate([
        { $match: { type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      FinancialRecord.aggregate([
        { $match: { type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);
    res.json({
      totalIncome: income[0]?.total || 0,
      totalExpense: expense[0]?.total || 0,
      netBalance: (income[0]?.total || 0) - (expense[0]?.total || 0)
    });
  } catch (err) { next(err); }
};

exports.categoryTotals = async (req, res, next) => {
  try {
    const results = await FinancialRecord.aggregate([
      { $group: { _id: { type: '$type', category: '$category' }, total: { $sum: '$amount' } } }
    ]);
    res.json(results);
  } catch (err) { next(err); }
};

exports.recentActivity = async (req, res, next) => {
  try {
    const records = await FinancialRecord.find().sort({ date: -1 }).limit(10).populate('createdBy', 'username role');
    res.json(records);
  } catch (err) { next(err); }
};

exports.trends = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    let groupId;
    if (period === 'week') {
      groupId = { year: { $year: '$date' }, week: { $isoWeek: '$date' }, type: '$type' };
    } else {
      groupId = { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' };
    }
    const results = await FinancialRecord.aggregate([
      { $group: { _id: groupId, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
    ]);
    res.json(results);
  } catch (err) { next(err); }
};
