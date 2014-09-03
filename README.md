**Currently this is not usable, still building.**

# ABA Tools

This is a Node module to support the generation of ABA files.
An ABA file is the most common way in Australia to import batch transactions to use for online banking.
This is different from the American Bankers Association format.

## Version
Current Version: 0.0.2

## Installation


### NPM Installation

```bash
  npm install aba-tools
```


### Meteor Package Installation

```bash
  meteor add albi:aba-tools
```



## Examples


### Basic Example

```javascript
  //add ABA to your node file
  var ABA = require('aba-tools');

  // build the descriptive record
  var descriptiveRecord = {
    sequence: 3,//sequence is...
    ///more
  };

  // build the detail records
  var detailRecords = [];
  detailRecords.push({
    amount: 321.0133, //this will be rounded on conversion
  })

  //generate the file
  var myABAFile = *new?* ABA.generate({..},[]);

  myAbaFile.result;
  //output: large multiline text with the entire file

  myAbaFile.lines;
  //output: array of text strings, representing each line
  //['line1', 'line2']

```

### Complex Example
using credits & debits
generating your own file from the output


## Record Types & Usage

### Descriptive Record

Full docs about this and what should be provided, what each thing means

### Detail Record

Full docs about this and what should be provided, what each thing means



# ABA (Cemtex) File Format
Source: http://www.cemtexaba.com/aba-format/cemtex-aba-file-format-details.html

## Description
Issued by the Australian Bankers Association (ABA) the ABA or Cemtext file format is a format used by banks to allow for batch transactions.

## Format Overview
Each line in an ABA file is a "record".
An ABA file has three main records, the "descriptive" record,
a "detail" record for each transaction and the "file total record" at the end.
The first character position of each new record indicates what type of record it is.
An ABA record is exactly 120 characters long (excluding new line characters).

## Record Types

### Descriptive Record (type 0)

| Char Pos                                     | Field Size | Field Description                                                                            | Specification                                                                                                                                                               |
|----------------------------------------------|------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1                                            | 1          | Record Type 0                                                                                | Must be '0'                                                                                                                                                                 |
| 2-18                                         | 17         | Blank                                                                                        | Must be filled.                                                                                                                                                             |
| 19-20                                        | 2          | Reel Sequence Number                                                                         | Must be numeric commencing at 01.  Right justified. Zero filled.                                                                                                            |
| 21-23                                        | 3          | Name of User's Financial Institution                                                         | Must be approved Financial Institution abbreviation. Bank of Queensland's abbreviation is BQL, Westpac's abbreviation is "WBC". Consult your Bank for correct abbreviation. |
| 24-30                                        | 7          | Blank                                                                                        | Must be blank filled.                                                                                                                                                       |
| 31-56                                        | 26         | Name of Use supplying file                                                                   | Must be User Preferred Specification as advised by User's FI. Left justified, blank filled. All coded character set valid. Must not be all blanks.                          |
| 57-62                                        | 6          | Name of Use supplying file                                                                   | Must be User Identification Number which is allocated by APCA. Must be numeric, right justified, zero filled.                                                               |
| 63-74                                        | 12         | Description of entries on file e.g. "PAYROLL"                                                | All coded character set valid. Must not be all blanks. Left justified, blank filled.                                                                                        |
| 75-80                                        | 6          | Date to be processed (i,e. the date transactions are released to all Financial Institutions) | Must be numeric in the formal of DDMMYY. Must be a valid date. Zero filled.                                                                                                 |
| 81-120                                       | 40         | Blank                                                                                        | Must be blank filled.                                                                                                                                                       |

*Note: all unused fields must be blank filled*

### Detail Record (type 1)

| Char Pos | Field Size | Record Type 1                           | Must be '1'                                                                                                                                                                                                  |
|----------|------------|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2-8      | 7          | Bank/State/Branch Number                | Must be numeric with hyphen in character position 5. Character positions 2 and 3 must equal valid Financial Institution number. Character position 4 must equal a valid state number (0-9).                  |
| 9-17     | 9          | Account number to be credited/debited   | Numeric, hyphens and blanks only are valid. Must not contain all blanks (unless a credit card transaction) or zeros. Leading zeros which are part of a valid account number must be shown, e.g. 00-1234.     |
| 18       | 1          | Indicator                               | <ul><li>"N" – for new or varied Bank/State/Branch number or name details, otherwise blank filled.</li><li>Withholding Tax Indicators</li><li>"W" – dividend paid to a resident of a country where a double tax agreement is in force.</li><li>"X" – dividend paid to a resident of any other country.</li><li>"Y" – interest paid to all non-residents.The amount of withholding tax is to appear in character positions 113-120</li><li>Note: Where withholding tax has been deducted the appropriate Indicator as shown above is to be used and will override the normal indicator.</li></ul> |
| 19-20    | 2          | Transaction Code                        | For most transactions this will be 53. Full list below                                                                                                                                                       |
| 21-30    | 10         | Amount                                  | Only numeric valid. Must be greater than zero. Shown in cents without punctuations. Right justified, zero filled. Unsigned.                                                                                  |
| 31-62    | 32         | Title of Account to be credited/debited | All coded character set valid. Must not be all blanks. Left justified, blank filled.  Desirable Format for Transaction Account credits: Surname (period) + Blank + given name with blanks between each name  |
| 63-80    | 18         | Lodgement Reference                     | All coded character set valid. Field must be left justified. No leading spaces, zeroes, hyphens or other characters can be included.                                                                         |
| 81-87    | 9          | Account Number                          | Right justified, blank filled.                                                                                                                                                                               |
| 97-112   | 16         | Name of Remitter                        | Name of originator of the entry. This may vary from Name of the User. All coded character set valid. Must not contain all blanks. Left justified, blank filled.                                              |
| 113-120  | 8          | Amount of Withholding Tax               | Numeric only valid. Show in cents without punctuation. Right justified, zero filled. Unsigned.                                                                                                               |

*Note: all fields must be completed*

### File Total Record (type 7)

| Char Pos                                     | Field Size | Field Description                   | Specification                                                                                                                                                            |
|----------------------------------------------|------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1                                            | 1          | Record Type 7                       | Must be '7'                                                                                                                                                              |
| 2-8                                          | 7          | BSB Format Filler                   | Must be '999-999'                                                                                                                                                        |
| 9-20                                         | 12         | Blank                               | Must be blank filled.                                                                                                                                                    |
| 21-30                                        | 10         | File (User) Net Total Amount        | Numeric only valid. Must equal the difference between File Credit & File Debit Total Amounts. Show in cents without punctuation. Right justified, zero filled. Unsigned. |
| 31-40                                        | 10         | File (User) Credit Total Amount     | Numeric only valid. Must equal the accumulated total of credit Detail Record amounts. Show in cents without punctuation. Right justified, zero filled. Unsigned.         |
| 41-50                                        | 10         | File (User) Debit Total Amount      | Numeric only valid. Must equal the accumulated total of debit Detail Record amounts. Show in cents without punctuation. Right justified, zero filled. Unsigned.          |
| 51-74                                        | 24         | Blank                               | Must be blank filled.                                                                                                                                                    |
| 75-80                                        | 6          | File (user) count of Records Type 1 | Numeric only valid. Must equal accumulated number of Record Type 1 items on the file. Right justified, zero filled.                                                      |
| 81-120                                       | 40         | Blank                               | Must be blank filled.                                                                                                                                                    |

*Note: all unused fields must be blank filled*


### Transaction Codes

| Code | Credit/Debit | Transaction Description                                                                 |
|------|--------------|-----------------------------------------------------------------------------------------|
| 13   | Debit        | Externally initiated debit items                                                        |
| 50   | Credit       | Externally initiated credit items with the exception of those bearing Transaction Codes |
| 51   | Credit       | Australian Government Security Interest                                                 |
| 52   | Credit       | Family Allowance                                                                        |
| 53   | Credit       | Pay                                                                                     |
| 54   | Credit       | Pension                                                                                 |
| 55   | Credit       | Allotment                                                                               |
| 56   | Credit       | Dividend                                                                                |
| 57   | Credit       | Debenture/Note Interest                                                                 |

## Bank Codes
Source: http://www.thebsbnumbers.com/
*Note: This may not be a complete list*

| Number      | Code        | Bank Name                                                           |
|-------------|-------------|---------------------------------------------------------------------|
| 01          | ANZ         | Australia and New Zealand Banking Group                             |
| 03 or 73    | WBC         | Westpac Banking Corporation                                         |
| 06 or 76    | CBA         | Commonwealth Bank of Australia                                      |
| 08 or 78    | NAB         | National Australia Bank                                             |
| 09          | RBA         | Reserve Bank of Australia                                           |
| 10          | BSA         | BankSA (division of Westpac Bank)                                   |
| 11 and 33   | STG and SGP | St George Bank (division of Westpac Bank)                           |
| 12          | BQL         | Bank of Queensland                                                  |
| 14          | PIB         | Rabobank                                                            |
| 15          | T&C         | Town & Country Bank                                                 |
| 18          | MBL         | Macquarie Bank                                                      |
| 19 and 55   | BOM and BML | Bank of Melbourne (division of Westpac Bank)                        |
| 21          | CMB         | JP Morgan Chase Bank                                                |
| 22          | BNP         | BNP Paribas                                                         |
| 23          | BAL         | Bank of America                                                     |
| 24          | CTI         | Citibank                                                            |
| 25          | BPS         | BNP Paribas Securities                                              |
| 26          | BTA         | Bankers Trust Australia (division of Westpac Bank)                  |
| 29          | BOT         | Bank of Tokyo-Mitsubishi                                            |
| 30          | BWA         | Bankwest (division of Commonwealth Bank)                            |
| 31          | MCU         | Bankmecu                                                            |
| 34 and 985  | HBA and HSB | HSBC Bank Australia                                                 |
| 35          | BOC         | Bank of China                                                       |
| 40          | CST         | Commonwealth Bank of Australia                                      |
| 41          | DBA         | Deutsche Bank                                                       |
| 42 and 52   | TBT         | Commonwealth Bank of Australia                                      |
| 45          | OCB         | OCBC Bank                                                           |
| 46          | ADV         | Advance Bank (division of Westpac Bank)                             |
| 47          | CBL         | Challenge Bank (division of Westpac Bank)                           |
| 48 or 664   | MET or SUN  | Suncorp-Metway                                                      |
| 512         | CFC         | Community First Credit Union                                        |
| 514         | QTM         | QT Mutual Bank                                                      |
| 57          | ASL         | Australian Settlements                                              |
| 61          | ADL         | Adelaide Bank (division of Bendigo and Adelaide Bank)               |
| 611         | SEL         | Select Credit Union                                                 |
| 630         | ABS         | ABS Building Society                                                |
| 632         | BAE         | B&E                                                                 |
| 633         | BBL         | Bendigo Bank                                                        |
| 634         | UFS         | Uniting Financial Services                                          |
| 637         | GBS         | Greater Building Society                                            |
| 638 and 880 | HBS         | Heritage Bank                                                       |
| 639         | HOM         | Home Building Society (division of Bank of Queensland)              |
| 640         | HUM         | Hume Bank                                                           |
| 641 and 647 | IMB and AUB | IMB                                                                 |
| 642         | ADC         | Australian Defence Credit Union                                     |
| 645 and 656 | MPB and BAY | Wide Bay Australia                                                  |
| 646         | MMB         | Maitland Mutual Building Society                                    |
| 650         | NEW         | Newcastle Permanent Building Society                                |
| 653         | PPB         | Pioneer Permanent Building Society (division of Bank of Queensland) |
| 655         | ROK         | The Rock Building Society                                           |
| 657         | GBS         | Greater Building Society                                            |
| 659         | SGE         | SGE Credit Union                                                    |
| 676         | GTW         | Gateway Credit Union                                                |
| 70          | CUS         | Indue                                                               |
| 721         | HCC         | Holiday Coast Credit Union                                          |
| 722         | SNX         | Southern Cross Credit                                               |
| 723         | HIC         | Heritage Isle Credit Union                                          |
| 724         | RCU         | Railways Credit Union                                               |
| 728         | SCU         | Summerland Credit Union                                             |
| 777         | PNB         | Police & Nurse                                                      |
| 80          | CRU         | Cuscal                                                              |
| 812         | TMB         | Teachers Mutual Bank                                                |
| 813         | CAP         | Capricornian                                                        |
| 814         | CUA         | Credit Union Australia                                              |
| 815         | PCU         | Police Bank                                                         |
| 817         | WCU         | Warwick Credit Union                                                |
| 818         | COM         | Bank of Communications                                              |
| 819         | IBK         | Industrial & Commercial Bank of China                               |
| 823         | ENC         | Encompass Credit Union                                              |
| 824         | STH         | Sutherland Credit Union                                             |
| 825         | SKY         | Big Sky Building Society                                            |
| 882         | MMP         | Maritime Mining & Power Credit Union                                |
| 90          | APO         | Australia Post                                                      |
| 913         | SSB         | State Street Bank & Trust Company                                   |
| 917         | ARA         | Arab Bank Australia                                                 |
| 918         | MCB         | Mizuho Bank                                                         |
| 922         | UOB         | United Overseas Bank                                                |
| 923 or 936  | ING or GNI  | ING Bank                                                            |
| 931         | ICB         | Mega International Commercial Bank                                  |
| 932         | NEC         | Community Mutual                                                    |
| 939         | AMP         | AMP Bank                                                            |
| 941         | BCY         | Delphi Bank (division of Bendigo and Adelaide Bank)                 |
| 942         | LBA         | Bank of Sydney                                                      |
| 943         | TBB         | Taiwan Business Bank                                                |
| 944         | MEB         | Members Equity Bank                                                 |
| 946         | UBS         | UBS AG                                                              |
| 951         | INV         | Investec Bank (Australia)                                           |
| 952         | RBS         | Royal Bank of Scotland                                              |
| 969         | MSL         | Tyro Payments                                                       |
| 980         | BOC         | Bank of China Australia                                             |



# Licence

 * Copyright 2014 Ben (LB) Johnston <mail@lb.ee>
 * ISC license Licensed under MIT (https://github.com/lb-/aba-tools/blob/master/LICENCE)


# Style Guide

Using https://github.com/meteor/meteor/wiki/Meteor-Style-Guide
