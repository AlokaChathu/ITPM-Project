export const calculateProgress = (weeklyReports, monthlyReports, missingReports) => {
  let progress = weeklyReports * 10 + monthlyReports * 20 - missingReports * 5;

  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  return progress;
};