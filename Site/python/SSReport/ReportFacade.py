from SSReport.ReportDAO import ReportDAO
from SSReport.Report import Report

class SSReportFacade:
    
    def __init__(self):
        self._reportsDAO = ReportDAO.instance()

    def addReport(self, report : Report) -> bool:
        return self._reportsDAO.put(report)
    
    def getAllReports(self) -> list:
        return self._reportsDAO.getAll()