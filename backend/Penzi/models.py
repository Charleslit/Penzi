from datetime import datetime

# Database operations
class queries:
    storeMatch = (
        "CREATE TABLE IF NOT EXISTS matches("
        "id INT PRIMARY KEY,"
        "name VARCHAR(255),"
        "age INT,"
        "phone VARCHAR(255),"
        "gender VARCHAR(255),"
        "county VARCHAR(255),"
        "town VARCHAR(255),"
        "dateCreated DATE)"
    )

    insertmatch = (
        "INSERT INTO matches (id, name, age, phone, gender, county, town, dateCreated) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )

    createuser = (
        "INSERT INTO Users (Name, Phone, Age, Gender, County, Town) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )

    insertuserdetails = (
        "INSERT INTO User_details (User_id, level_of_education, profession, marital_status, religion, ethnicity) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )

    usersdescription = (
        "INSERT INTO Penzi.User_description (User_id, Description) "
        "VALUES (%s, %s)"
    )

    messages = (
        "INSERT INTO Messages (User_id, Message, Message_type, dateReceived) "
        "VALUES (%s, %s, %s, %s)"
    )

    creatematchrequest = (
        "INSERT INTO Matching_request (User_id, Message_id, Age, Town, Subsequent) "
        "VALUES (%s, %s, %s, %s, %s)"
    )

    insertmatchrequest = (
        "INSERT INTO Match (Matching_request_id, Describe_no, MoreDetails, Confirmation) "
        "VALUES (%s, %s, %s, %s)"
    )

    matchuser = (
        "SELECT * FROM Users WHERE Age = %s AND Town = %s"
    )

    describeuser = (
        "SELECT * FROM User_description WHERE msisdn = %s"
    )
