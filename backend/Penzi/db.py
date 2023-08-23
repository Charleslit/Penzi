import logging
import re
from flask_paginate import Pagination
from flask import jsonify
import json ,signal ,threading
from Penzi import app,db
from Penzi.models import queries
import mysql.connector
# Import the queries class from models.py
from Penzi.models import queries
logging.basicConfig(filename='error.log', level=logging.ERROR)

# Create an instance of the queries class
db_queries = queries()

# Access the queries defined in the class
store_match_query = db_queries.storeMatch
insert_match_query = db_queries.insertmatch
createuserquery = db_queries.createuser
insertuserdetails = db_queries.insertuserdetails
usersdescription  = db_queries.usersdescription 
class DatabaseError(Exception):
    def __init__(self, message, error_code):
        super().__init__(message)
        self.error_code = error_code
import re
from flask import jsonify

def handle_profile(Phone):
    phone=checkphone(Phone)
    print(phone)
    #Execute SQL query
    query = "SELECT * FROM Users WHERE Phone = %s"
    with db.cursor() as cursor:
        cursor.execute(query, (phone,))
        result = cursor.fetchone()
        print(result)
    # Check if result is empty
    if not result:
        return jsonify({'error': 'User not found'})

    # Create dictionary with user data
    id, Name, Phone, Age, Gender, County, Town, dateCreated = result
    match = {
        "id": id,
        "name": Name,
        "age": Age,
        "phone": Phone,
        "gender": Gender,
        "county": County,
        "town": Town,
        "dateCreated": dateCreated
    }

    # Return user data as JSON
    print(match)
    if isinstance(match, dict):  # Check if req is a single message
            match = [match] 
            return jsonify(match)
    else:
        return jsonify(match)

    
        # return jsonify({"message": "User profile not found"})
def fetch_users():
    query = "SELECT * FROM Users"
    with db.cursor() as cursor:
        cursor.execute(query)
        results = cursor.fetchall()
        
        return results

        # Set the batch size for fetching data
        # batch_size = 100

        # while True:
        #     batch = cursor.fetchmany(batch_size)
        #     if not batch:
        #         break

        #     for row in batch:
        #         yield {
        #             "id": row[0],
        #             "name": row[1],
        #             "phone": row[2],
        #             "age": row[3],
        #             "gender": row[4],
        #             "county": row[5],
        #             "town": row[6],
        #             "dateCreated": row[7]
        #         }

def mainhandler(Phone, Message,client_id):
        messageType = "incoming"
        Phone =checkphone(Phone) 
        results = check_user(Phone)
        if results is not None:
            User_id = results[0]
            storeMessage(Message, messageType, User_id)
            return  handle_message(Message, Phone,client_id)
        else:
            User_id = Phone
            storeMessage(Message, messageType, User_id)
            return handle_message(Message, Phone,client_id)
def SendBulkSMS(text, Phone, client_id):
    # phone = f"{Phone}@c.us"
    # url = "https://wa.e-notice.co.ke/qr/send-message"http://localhost:5173

    # headers = {
    #     'client_id': client_id,
    #     'auth-key': '5ohsRCA8os7xW7arVagm3O861lMZwFfl'
    # }

    # body = {
    #     'chat_id': phone,
    #     'message': text,
    #     'type': 'chat'
    # }


    # response = requests.post(url, headers=headers, json=body)

    # if response.ok:
        time = datetime.now()
        print(time,text, Phone, client_id)
        return jsonify(text)
        # return jsonify({'reply': str(text)})
    # else:
    #     return jsonify({'success': str(response)})

def handle_welcome(Phone ,client_id):
    text = ("Welcome to our dating service with 6000 potential dating partners!\n"
                    "To register SMS start#name#age#gender#county#town to 22141."
                    "E.g., start#John Doe#26#Male#Nakuru#Naivasha")
   
    return Saveoutgoing(text , Phone ,client_id)
from datetime import datetime, time    

def storeMessage(Message, messageType, User_id):
    try:
        date = datetime.now()
        with db.cursor() as cursor:
            query = "INSERT INTO Messages (User_id, Message, Message_type, dateReceived) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (User_id, Message, messageType, date))
        db.commit()  #commit the changes to the database
        return "processed"
    except mysql.connector.Error as err:
        error_message = f"DATABASE ERROR! : {str(err)}"
        return jsonify(error_message)    

    except Exception as e:
        error_message = f"Error : {str(e)} in store message"
        return jsonify(error_message)    
def Saveoutgoing(text, Phone,client_id):
    try:
        messageType = "outgoing"
        Message = text

        query = "SELECT id FROM Users WHERE Phone = %s"
        with db.cursor() as cursor:
            cursor.execute(query, (Phone,))
            results = cursor.fetchone()
        
        if results is not None and len(results) > 0:
            User_id = results[0]
            storeMessage(Message, messageType, User_id)
            return SendBulkSMS(text, Phone,client_id)
        else:
            User_id = Phone 
            storeMessage(Message, messageType, User_id)
            return SendBulkSMS(text, Phone,client_id)
    
    except Exception as e:
        error_message = f"{str(e)} in Saveoutgoing"
        return jsonify(error_message)  # Use jsonify to return JSON response


def checkphone(Phone):
  try:
    if len(Phone) == 10:
                    Phone = f"254{Phone[1:]}"
                    return Phone
    elif len(Phone) == 12:
            return Phone
  except Exception as e:
        error_message = f"Error: {str(e)} in checkphone"
        return jsonify(error=error_message)
def check_user(Phone):
    query = "SELECT id , Name FROM Users WHERE Phone = %s"
    with db.cursor() as cursor:
        cursor.execute(query, (Phone,))
        results = cursor.fetchone()
    return results

def welcome_user(Phone,client_id):
    try:
        result = check_user(Phone)
        Name = result[1]
        text = (f"Hey {Name}! You are registered for dating."
                "To search for a MPENZI, SMS match#age#town to 22141 and meet the person of your dreams."
                "E.g., match#23-25#Kisumu"
                )
        Saveoutgoing(text, Phone,client_id)
        return jsonify(text)
    
    except Exception as e:
        error_message = f"Error: {str(e)} in welcome_user"
        return str(error_message)
KEYWORDS = {
    "welcome": ["penzi", "start","hello"],
    "describe":["describe"],
    "response": ["yes"],
    "paginate": ["next"],
    "fetch_details": ["phone"]
}

def handle_message(message, phone, client_id):
    try:
        result = check_user(phone)
        
        if result is not None:
            message_type = get_message_type(message)
            if message_type == "welcome":
                return handle_welcome(phone, client_id)
            elif message_type == "response":
                return handle_response(message, phone, client_id)
            elif message_type == "paginate":
                return handle_paginate(message, phone, client_id)
            elif message_type == "fetch_details":
                return handle_fetch_details(message, phone, client_id)
            elif message_type =="describe":
                return handle_described(message, phone,client_id)
            elif re.match("^\d{10}$", message) or re.match("^\d{12}$", message):
                return handle_fetch_details(message,phone,client_id)
            
            else:
                    return handle_keywords(message, phone, client_id)
        else:
            if "start" in message:
                return handle_keywords(message, phone, client_id)
            else:
             return handle_welcome(phone, client_id)
    except Exception as e:
        error_message = f"Error: {str(e)} in handle_message"
        return error_message
def handle_described(message, phone,client_id):
    text = "did you want to request a description of someone . To get a description  Send DESCRIBE `number ` to get more details about the `number` "
    return Saveoutgoing(text, phone, client_id) 
def get_message_type(message):
    for type, keywords in KEYWORDS.items():
        for keyword in keywords:
            if message.lower() == keyword:
                return type
    return "keywords"

def handle_welcome(phone, client_id):
    if check_user(phone) is None:
        return handle_new_user(phone, client_id)
    else:
        return handle_existing_user(phone, client_id)

def handle_new_user(Phone, client_id):
    # Handle welcome message for new users
    text = ("Welcome to our dating service with 6000 potential dating partners!\n"
                    "To register SMS start#name#age#gender#county#town to 22141."
                    "E.g., start#John Doe#26#Male#Nakuru#Naivasha")
   
    return Saveoutgoing(text , Phone ,client_id)

def handle_existing_user(phone, client_id):
   return welcome_user(phone , client_id,)

def handle_response(Message, Phone, client_id):
    # Handle user response to previous message
    return get_user_response(Message, Phone,client_id)
def handle_keyword(content, keyword, Phone, client_id):
    try:
        if "start" in keyword:
            return handle_registration(content, Phone, client_id)
        elif "details" in keyword:
            return handle_details_registration(content, Phone, client_id)
        elif "myself" in keyword:
            return handle_self_description(content, Phone, client_id)
        elif "match" in keyword:   
            return handle_matching(content, Phone, client_id)
        elif "next" in keyword:
            return handle_paginate(content, Phone, client_id)
        elif keyword == "describe":
            return handle_describe(content, Phone, client_id)
        else:
            return handle_welcome(Phone, client_id)
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        logging.error(error_message)
        return Saveoutgoing(error_message, Phone, client_id)


def handle_fetch_details(message, phone, client_id):
    if len(message) == 10:
        if re.match("^\d{10}$", message):
            phonen = f"254{message[1:]}"
            if phone == phonen:
                text= "you can not ask description of yourself"
                return Saveoutgoing(text, phone, client_id)
            else:
                return handle_fetch_detail(phonen, phone, client_id)
        else:
            error_message = "Invalid phone number format. Please enter a 10 or 12 digit phone number."
            return Saveoutgoing(error_message, phone, client_id)
    elif len(message) == 12:
        if re.match("^\d{12}$", message):
            phonec = phone
            phone = message
            return handle_fetch_detail(phone, phonec, client_id)
        else:
            error_message = "Invalid phone number format. Please enter a 10 or 12 digit phone number."
            return Saveoutgoing(error_message, phone, client_id)
    else:
        error_message = "Please enter a valid phone number."
        return Saveoutgoing(error_message, phone, client_id)

def handle_keywords(message, Phone, client_id):
    m = message.split("#")
    if len(m) > 1:
        keyword = m[0].lower()
        content = m[1:]
        try:
            return handle_keyword(content,keyword, Phone,client_id)
        except Exception as e:
            error_message = f"An error occurred: {str(e)} please try again"
            return Saveoutgoing(error_message, Phone, client_id)
    else:
        m = message.split(maxsplit=1)
        if len(m) > 1:
            keyword = m[0].lower()
            content = m[1]
            try:
                return handle_keyword(content,keyword, Phone,client_id)
            except Exception as e:
                error_message = f"An error occurred: {str(e)} please try again after sometime "
                return Saveoutgoing(error_message, Phone, client_id)
        else:
            error_message = f"'{message}' is not a valid keyword. Please try again."
            return Saveoutgoing(error_message, Phone, client_id), 200

def handle_registration(content, Phone,client_id):
    try:
        result =  check_user(Phone)
        if result is None:


            if len(content) > 1:
                Name, Age, Gender, County, Town = content
                details = Name,Phone, Age, Gender.lower(), County.lower(), Town.lower() 
                with db.cursor() as cursor:
                    cursor.execute(createuserquery ,details)
                    db.commit()
                    text = ("Your profile has been created successfully "+ Name + ".\n"
                            "SMS details#levelOfEducation#profession#maritalStatus#religion#ethnicity to 22141.\n"
                             "E.g. details#diploma#driver#single#christian#mijikenda\n"
                             )
                return Saveoutgoing(text, Phone,client_id)
                    # return sleeped(response)
            
                # return jsonify({"Response": "OK."}), 200
            else:
                text = ({"message": "Invalid registration format."})
                return Saveoutgoing(text, Phone,client_id), 200
        else:
            return welcome_user(Phone,client_id)
    except mysql.connector.Error as err:
        error_message = f"Database Error:,{str(err)}"
        return jsonify(error_message)
    except Exception as e:
        error_message = f"error: ,{str(e)} in handle_registration"
        return jsonify(error_message)    

def handle_details_registration(content, Phone, client_id):
    try:
        # Validate the user's input
        if len(content) != 5:

            text = "Please provide your level of education, profession, marital status, religion, and ethnicity."
            return Saveoutgoing(text, Phone,client_id), 200
        # Retrieve the user's ID from the Users table
        query = "SELECT id FROM Users WHERE Phone = %s"
        with db.cursor() as cursor:
            cursor.execute(query, (Phone,))
            results = cursor.fetchone()

        if not results:
            # The user does not exist, so redirect to the welcome screen
            return handle_welcome(Phone, client_id)
        else:
            user_id = results[0]

            # Check if the user has already registered their details
            exists_clause = "SELECT 1 FROM User_details WHERE User_id = %s"
            with db.cursor() as cursor:
                cursor.execute(exists_clause, (user_id,))
                exists = cursor.fetchone()

            if exists:
                # The user has already registered their details
                text ="You have already registered your details. To search for a partner, send MATCH to 22141."
                return Saveoutgoing(text, Phone,client_id), 200
            else:
                # Insert the user's details into the User_details table
                details = (user_id, *content)
                with db.cursor() as cursor:
                    cursor.execute(insertuserdetails, details)
                    db.commit()

                # Send a customized message to the user
                text = (
                    "Thank you for registering your details. "
                    "To complete your profile, send a brief description of yourself starting with the word MYSELF to 22141. "
                    "E.g., MYSELF chocolate, lovely, sexy, etc."
                )
                return Saveoutgoing(text, Phone, client_id)

                # Return a success message
                

    except mysql.connector.Error as err:
        error_message = f"Database Error: {str(err)}"
        return {"status": "error", "message": error_message}

    except Exception as e:
        error_message = f"Error: {str(e)} in handle_details_registration"
        return {"status": "error", "message": error_message}
def check_userdescription(User_id):
    try:
        exists_clause = "(SELECT 1 FROM User_description WHERE User_id = %s)"
        with db.cursor() as cursor:
            cursor.execute(exists_clause, (User_id,))
            results = cursor.fetchone()
        return results
    
    except Exception as e:
        error_message = f"Error: {str(e)} in check_userdescription"
        return str(error_message)

def handle_self_description(content, Phone,client_id):
    try:
        
        x = check_user(Phone)
        if x is None:#then the user does not exist
            return handle_welcome(Phone, client_id)
        else:
            User_id = x[0]
            # check if the user_description  exists :
            y = check_userdescription(User_id)
            if y :
                  text = ("You are already registered for dating."
                         "To search for a MPENZI, SMS match#age#town to 22141 and meet the person of your dreams."
                         "E.g., match#23-25#Kisumu"
                         )
                  return Saveoutgoing(text , Phone, client_id)
                  
            else:         
                description = (User_id, content)

                with db.cursor() as cursor:
                    cursor.execute(usersdescription, description)
                    db.commit()
                    text = ("You are now registered for dating."
                         "To search for a MPENZI, SMS match#age#town to 22141 and meet the person of your dreams."
                         "E.g., match#23-25#Kisumu"
                         )
                    
                return  Saveoutgoing(text , Phone, client_id)
                # return jsonify({"response": text})
            

    except mysql.connector.Error as err:
        error_message = f"Database Error : {str(err)}"
        return jsonify(error_message)
    except Exception as e:
        error_message = f" Error : {str(e)} in handle selfdescription"
        return jsonify(error_message) 

 
def check_message(User_id):
    try:  
        query = "SELECT id ,Message FROM Messages WHERE User_id = %s order by dateReceived desc limit 1 "
        with db.cursor() as cursor:
            cursor.execute(query,(User_id,))
            results = cursor.fetchone()
        return results   
    except Exception as e:
        error_message = f"Error: {str(e)} in check_message"
        return jsonify(error_message)         

def check_request(User_id):
    try:  
        message = f"%atch#%"
        message_type = "incoming"
        query = "SELECT id,Message  FROM Messages WHERE User_id = %s AND Message LIKE %s AND Message_type = %s ORDER BY dateReceived DESC LIMIT 1"
        with db.cursor() as cursor:
            cursor.execute(query,(User_id,message,message_type,))
            results = cursor.fetchone()
        return results   
    except Exception as e:
        error_message = f"Error: {str(e)} in checkrequest_message "
        return jsonify(error_message)         


def savematchrequest(Age,Town,Phone):
    try:
         results = check_user(Phone)    
         User_id = results[0]  
         Message = check_message(User_id)
         Message_id = Message[0] 
         query = ("INSERT INTO Match_request(User_id,Message_id,Age,Town)"
                    "VALUES(%s,%s,%s,%s)"  
                    )
         with db.cursor() as cursor:
                        cursor.execute(query, (User_id,Message_id,Age,Town))
                        db.commit()
                        
         return "ok" 
    except Exception as e:
        error_message = f"Error: {str(e)} in savematchrequest"
        return str(error_message)
def GetRequestid(userid,messageid):
    query = "SELECT id FROM Match_request WHERE  User_id = %s AND Message_id = %s "
    with db.cursor() as cursor:
        cursor.execute(query,(userid, messageid,))
        results = cursor.fetchone()
    return results[0]

def Get_gender(Phone):
    try:
        query = "SELECT Gender FROM Users WHERE Phone = %s"
        with db.cursor() as cursor:
            cursor.execute(query, (Phone,))
            results = cursor.fetchone()
            Gender = results[0]
        return Gender

    except Exception as e:
        error_message = f"Error: {str(e)} in Get_gender"
        return str(error_message)

def genderconverter(Phone):
    try:
        g = Get_gender(Phone)
        gender = g
        if gender.lower() == "female":
            Gender = "male"
            return Gender
        elif gender.lower() == "male":
            Gender = "female"
            return Gender
        else:
            return gender

    except Exception as e:
        error_message = f"Error: {str(e)} in genderconverter"
        return str(error_message)

def find_matches(Gender, Age, Town):
    try:
        with db.cursor() as cursor:
            if '-' in Age:
                age1, age2 = Age.split('-')
                query = "SELECT * FROM Users WHERE Gender = %s AND Age BETWEEN %s AND %s AND Town = %s"
                cursor.execute(query, (Gender, age1, age2, Town))
            else:
                query = "SELECT * FROM Users WHERE Gender = %s AND Age = %s AND Town = %s"
                cursor.execute(query, (Gender, Age, Town))
            matches = cursor.fetchall()
        return matches
    except mysql.connector.Error as err:
        raise DatabaseError(str(err))

def generate_response_text(matches, gender):
    """Generates the response text to be sent to the user."""
   
    try:
        if not matches:
            text = "No matches found for your category. Please adjust your choices and try again."
        else:
            text = "We have {} {} who match your choice! We will send you details of 3 of them shortly. To get more details about a {}, SMS her/his number. to 22141\n".format(len(matches), gender, gender)
            details_text = ""
            for match in matches[:3]:
                id, name, phone, age, gender, county, town, date_created = match
                details_text += "\n {} aged {}, {}  \n".format(name, age, phone)
            fulltext = text +"\n " + details_text + "\n"
        return fulltext

    except Exception as e:
        logging.error("An error occurred while generating the response text: %s", str(e))

def save_matches(matches, user_id, message_id):
    """Saves the matches to the database."""
    try:
        with db.cursor() as cursor:
            for match in matches:
                id, name, phone, age, gender, county, town, date_created = match
                savematch ="\n{}, {}, {}\n".format(name, age, phone)
                query = ("INSERT INTO Matches"
                         "(User_id, Match_request_id, matches)"
                         "VALUES(%s, %s, %s)")
                cursor.execute(query, (user_id, message_id, savematch))
            db.commit()
    except Exception as e:
        logging.error("An error occurred while saving matches: %s", str(e))
import pdb
def handle_matching(content, phone, client_id):
    try:
        age, town = content
        savematchrequest(age, town, phone)
        gender = genderconverter(phone)
        matches = find_matches(gender, age, town)
        if not matches:
            text = "No matches found for your category. Please adjust your choices and try again."
            return Saveoutgoing(text, phone, client_id)
        else:
            user_id = check_user(phone)[0]
            message_id = check_request(user_id)[0]  
            request_id = GetRequestid(user_id, message_id)
            save_matches(matches, user_id, request_id)
            fulltext = generate_response_text(matches, gender)
            
            # pdb.set_trace()
            return Saveoutgoing(fulltext, phone, client_id), 200

    except ValueError:
        text = "Invalid age range format. Please enter the age range in the format '18-25'."
        return Saveoutgoing(text, phone, client_id)
    except Exception as e:
        logging.exception("Error in handle_matching")
        error_message = f"Error: {str(e)} in handle_matching"
        return Saveoutgoing(error_message, phone, client_id)
def handle_paginate(m, Phone, client_id):
    try:
        if m.lower() == "next":
            user_id = check_user(Phone)[0]

            # Retrieve the user's age and town from the Match_request table
            keyword ,age, town  = check_request(user_id)[1].split("#")
            id = check_request(user_id)[0]
            sub = "SELECT Subsequent FROM Match_request WHERE User_id = %s AND Message_id = %s ORDER BY Message_id DESC LIMIT 1"
            with db.cursor() as cursor:
                cursor.execute(sub, (user_id, id))
                result = cursor.fetchone()
                        
            if result is None or result == (None,):
                subsequent = 0
            else:
                subsequent = int(result[0])
                        

            # Retrieve the matches for the user's age and town
            matches_generator = match(town, age, gender=genderconverter(Phone))
            matches = list(matches_generator)

            # Determine the next page of matches to send
            page_size = 3
            start = subsequent
            end = min(subsequent + page_size, len(matches))
            paginated_matches = matches[start:end]

            # If there are no more matches to send, return a message indicating that
            if len(paginated_matches) == 0:
                text="No more matches remaining to send."
                return Saveoutgoing(text,Phone,client_id)
            elif end == len(matches):
                text="All matches have been sent."
                return Saveoutgoing(text,Phone,client_id)
            text = ""
            # Process the paginated matches and send them as separate messages
            for match_item in paginated_matches:
                text += "\nName: {}\nAge: {}\nPhone: {}\n \nCounty: {}\nTown: {}\n".format(
                     match_item["name"], match_item["age"], match_item["phone"],  match_item["county"], match_item["town"]
                )
                Saveoutgoing(text, Phone, client_id)

            # Update the subsequent value in the Match_request table
            query = "UPDATE Match_request SET Subsequent = %s WHERE User_id = %s"
            with db.cursor() as cursor:
                cursor.execute(query, (end, user_id))
                db.commit()

            # Check if all matches have been sent
            return jsonify(text)
            
    except Exception as e:
        logging.exception("Error in handle_paginate")
        return "An error occurred while processing your request. Please try again later."


def match(town, age, gender=None, county=None, region=None):
    try:
        query_params = [age, town]
        query = "SELECT * FROM Users WHERE Age = %s AND Town = %s"

        optional_params = {}
        if gender:
            optional_params["gender"] = gender
        if county:
            optional_params["county"] = county
        if region:
            optional_params["region"] = region

        if optional_params:
            query += " AND " + " AND ".join([f"{param} = %s" for param in optional_params])
            query_params.extend([optional_params[key] for key in optional_params])

        
        with db.cursor() as cursor:
                cursor.execute(query, query_params)

                row = cursor.fetchone()
                while row is not None:
                    id, name, phone, age, gender, county, town, date_created = row
                    match = {
                        "id": id,
                        "name": name,
                        "age": age,
                        "phone": phone,
                        "gender": gender,
                        "county": county,
                        "town": town,
                        "dateCreated": date_created
                    }
                    yield match
                    row = cursor.fetchone()

    except Exception as e:
        error_message = f"Error: {str(e)} in match"
        return jsonify(error_message)


def handle_fetch_detail(Phone, Phonec,client_id):
    try:
        phones = [Phone]
        for Phone in phones:
            query = "SELECT * FROM Users WHERE Phone = %s"
            with db.cursor() as cursor:
                cursor.execute(query, (Phone,))
                results = cursor.fetchall()
            if results:

                for row in results:
                    id, Name, Phone, Age, Gender, County, Town, dateCreated = row

                    details_query = "SELECT * FROM User_details WHERE User_id = %s"
                    with db.cursor() as cursor:
                        cursor.execute(details_query, (id,))
                        result = cursor.fetchone()

                    if result:
                        id, User_id, level_of_education, profession, marital_status, religion, ethnicity = result

                        details = (Name, Age, County, Town, level_of_education, profession, marital_status, religion, ethnicity)
                        return handle_moredetails(*details, Phone, Phonec,client_id)
                    else:
                         return jsonify("user has no results ")
            else:
                raise ValueError("Requested phone number was not found in the database.")
                

        return None
    except mysql.connector.Error as err:
        error_message = f" Database Error: {str(err)} in handle_fetchetails"
        return  jsonify(error_message)

    except Exception as e:
        error_message = f"Error: {str(e)} "
        return jsonify(error_message)
    
def saveoutgoing(text,Phonec,client_id):
    Phone = Phonec
    Saveoutgoing(text,Phone,client_id)

def handle_moredetails(Name, Age, County, Town, level_of_education, profession, marital_status, religion, ethnicity, Phone, Phonec, client_id):
    try:
        text = f"{Name} aged {Age}, {County} County, {Town} town, {level_of_education}, {profession}, {marital_status}, {religion}, {ethnicity}. Send DESCRIBE {Phone} to get more details about {Name}."
        saveoutgoing(text, Phonec,client_id)
        requestedname = Name
        requestedPhone = Phone
        text1 = None
        
        def inform_requested(Phonec):
            nonlocal text1  # Use the nonlocal keyword to indicate we want to modify the outer variable
            query = "SELECT * FROM Users WHERE Phone = %s"
            with db.cursor() as cursor:
                cursor.execute(query, (Phonec,))
                results = cursor.fetchall()
            
            for row in results:
                id, Name, Phone, Age, Gender, County, Town, dateCreated = row
    
                text1 = f"Hi {requestedname}, a man called {Name} is interested in you and requested your details. He is aged {Age} based in {Town}. Do you want to know more about him? Send YES to 22141"
                save(requestedPhone,text1,client_id)
                time.sleep(3)
                
                Message = text1
                
                return jsonify(text1)
        
        text1 = inform_requested(Phonec)  # Call the inner function to set the value of text1
        return jsonify(text)
    
    except Exception as e:
        error_message = f"Error: {str(e)} in handle_moredetails"
        return str(error_message)
def save(requestedPhone,text1,client_id):
    Phone = requestedPhone 
    text = text1  
    return Saveoutgoing(text, Phone,client_id)
    
def get_user_response(Message, Phone,client_id):
    try:
        c = check_user(Phone)
        User_id = c[0]
        Name = c[1]

        message = f"%{Name}, a man called%"

        query = "SELECT  Message,id FROM Messages WHERE User_id = %s AND Message LIKE %s ORDER BY dateReceived DESC LIMIT 1"

        with db.cursor() as cursor:
            cursor.execute(query, (User_id, message))
            result = cursor.fetchall()

        if result:
            id = result[0][1]
            message = result[0][0]  # Extract the message from the result
            name_start = message.find("called ") + len("called ")  # Find the start position of the name
            name_end = message.find(" is interested")  # Find the end position of the name
            name = message[name_start:name_end]  # Extract the name

            age_start = message.find("aged ") + len("aged ")  # Find the start position of the age
            age_end = message.find(" based")  # Find the end position of the age
            age = message[age_start:age_end]  # Extract the age

            town_start = message.find("based in ") + len("based in ")  # Find the start position of the town
            town_end = message.find(". Do you want")  # Find the end position of the town
            town = message[town_start:town_end]  # Extract the town
            details = (name, age, town)
            updatematches(Phone,id,User_id)
            phone = Phone

            return fetch(name, age, town,phone,client_id)
            # return result
        else:
            text = "nobody has requsted your details"
            return Saveoutgoing(text,Phone,client_id)
            # return result
            

    except Exception as e:
        error_message =f"Error {str(e)} in get_user_response"
        return error_message
def updatematches(phone,id,userid):
    matches = f"%{phone}%"  
    query = "UPDATE Matches SET Confirmation ='yes' WHERE matches LIKE %s ORDER BY dateCreated DESC LIMIT 1"
    with db.cursor() as cursor:
        cursor.execute(query,(matches,)) 
    return "ok"
def fetch(name, age, town, phone,client_id):
    try:

        detail_query = "SELECT id, Phone FROM Users WHERE Name = %s AND Age = %s AND Town = %s LIMIT 1"

        with db.cursor() as cursor:
            cursor.execute(detail_query, (name, age, town,))
            uid = cursor.fetchall()
            if not uid:
                return None  # Return None if no user was found with the given criteria
            user_id = uid[0][0]
            Phone = uid[0][1]

        details_query = "SELECT * FROM User_details WHERE User_id = %s"
        with db.cursor() as cursor:
            cursor.execute(details_query, (user_id,))
            results = cursor.fetchall()

        if results:
            _, _, level_of_education, profession, marital_status, religion, ethnicity = results[0]

            text = f"{name} aged {age}, {town} town, {level_of_education}, {profession}, {marital_status}, {religion}, {ethnicity}. Send DESCRIBE {Phone} to get more details about {name}."
            
            Phone = phone
            return Saveoutgoing(text, Phone,client_id)
    
    except Exception as e:
        error_message = f"Error: {str(e)} in fetch"
        return str(error_message)

def handle_describe(content, Phone,client_id):
    try:
        query = "SELECT id , Name  FROM Users WHERE Phone = %s"
        with db.cursor() as cursor:
            cursor.execute(query, (content,))
            results = cursor.fetchone()

        if not results:  # then the user  requested does not exist
            return "requested user does not exist"
            # once again check if the user has any details
        else:
            user_id = str(results[0])
            Name = str(results[1])
            exists_clause = "SELECT Description FROM User_description WHERE User_id = %s"
            with db.cursor() as cursor:
                cursor.execute(exists_clause, (user_id,))
                exists = cursor.fetchone()

            if exists:
                desc = exists[0]  # Extract the description from the exists tuple
                desc = desc.strip("[]\"'")  # Remove square brackets and quotation marks
                text = f"{Name} describes himself as {desc}"
                return Saveoutgoing(text, Phone,client_id)  # Send the description via SMS
               


            else:
                return send_message(Phone,client_id)  # Call the handle_welcome function instead of returning its result
       
        
    except mysql.connector.Error as err:
        error_message = f"Database error: {str(err)}"
        return jsonify(error_message)
    except Exception as e:
        error_message = f"Error: {str(e)} in handle describe"
        return jsonify(error_message)

def send_message(Phone,client_id):
    try:
        text = ("You were registered for dating with your initial details."
                "To search for a MPENZI, SMS match#age#town to 22141 and meet the person of your dreams."
                "E.g., match#23-25#Nairobi"
                )
        now = time.time()
        send_time = now + 5
        
        def send_message_thread():
            Saveoutgoing(text, Phone,client_id)
           
        thread = threading.Thread(target=send_message_thread)
        thread.start()
    
    except Exception as e:
        error_message = f"Error: {str(e)} in send_message"
        return str(error_message)
