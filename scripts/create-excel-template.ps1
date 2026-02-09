$ErrorActionPreference = 'Stop'

$path = Join-Path $env:USERPROFILE 'Desktop\Lynco_WPS_Template.xlsx'

$xl = New-Object -ComObject Excel.Application
$xl.Visible = $true
$wb = $xl.Workbooks.Add()

function Setup-Sheet([object]$ws, [string]$name, [string[]]$headers) {
  $ws.Name = $name
  for ($i = 0; $i -lt $headers.Count; $i++) {
    $cell = $ws.Cells.Item(1, $i + 1)
    $cell.Value2 = $headers[$i]
    $cell.Font.Bold = $true
    $cell.Interior.ColorIndex = 15
    $cell.Font.ColorIndex = 1
  }
  $ws.Rows.Item(1).RowHeight = 20
  $ws.Range($ws.Cells.Item(1, 1), $ws.Cells.Item(1, $headers.Count)).AutoFilter() | Out-Null
  $ws.Columns.AutoFit() | Out-Null
}

$ws1 = $wb.Worksheets.Item(1)
Setup-Sheet $ws1 'Leads' @('Lead ID','Company','Contact','Email','Phone','Source','Stage','Owner','Created At','Next Step','Notes')

$ws2 = $wb.Worksheets.Add()
Setup-Sheet $ws2 'Deals' @('Deal ID','Company','Deal Name','Stage','Amount','Currency','Probability','Close Date','Owner','Last Activity','Next Activity','Notes')

$ws3 = $wb.Worksheets.Add()
Setup-Sheet $ws3 'Activities' @('Activity ID','Type','Related (Lead/Deal)','Subject','Due Date','Status','Owner','Notes')

$ws4 = $wb.Worksheets.Add()
Setup-Sheet $ws4 'Invoices' @('Invoice ID','Company','Deal ID','Issue Date','Due Date','Subtotal','Tax','Total','Currency','Status','Paid Date','Notes')

$ws5 = $wb.Worksheets.Add()
Setup-Sheet $ws5 'Config' @('Field','Value','Description')
$ws5.Cells.Item(2,1).Value2='Currency'
$ws5.Cells.Item(2,2).Value2='KRW'
$ws5.Cells.Item(2,3).Value2='Default currency'
$ws5.Cells.Item(3,1).Value2='Owner'
$ws5.Cells.Item(3,2).Value2=''
$ws5.Cells.Item(3,3).Value2='Default owner name'
$ws5.Columns.AutoFit() | Out-Null

$wb.SaveAs($path)
Write-Output "Saved: $path"
