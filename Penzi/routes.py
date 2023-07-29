from flask import Flask, jsonify, request
import pdp
import requests
import json
from Penzi import app 
from Penzi.models import queries
from Penzi.db import mainhandler,handle_profile,users


@app.route("/whatsapp" , methods=['POST'])
def receive_whatsapp():
    try:
        req = request.get_json()
        ack = req.get("ack")

        print(req)
        client_id = req.get("client_id")
        
        Message = req.get("body")
        Phone = req.get("from")
        shortCode = req.get("shortCode")
        dateReceived = req.get("dateReceived")
        if ack == 1 and Phone.endswith("@c.us"):
            phone = Phone.split('@')
            Phone = phone[0]
            return jsonify({"reply":mainhandler(Phone,Message ,client_id)})
        else:
            return jsonify({"message":"message success"})

    except Exception as e:
        error_message = f"Error: {str(e)} in whatsapp"
        return jsonify({"reply":error_message})


from flask import jsonify, request
from Penzi.models import queries

@app.route("/sms", methods=['POST'])
def handle_sms():
    try:
        req = request.get_json()
        print(req)
        if not req:
            return jsonify(error="Invalid JSON data")

        if isinstance(req, dict):  # Check if req is a single message
            req = [req]  # Convert single message to a list

        # Create an instance of the queries class

        for r in req:
            message = r.get("message")
            phone = r.get("msisdn")
            short_code = r.get("shortCode")  # Assuming shortCode may be missing in some cases
            date_received = r.get("dateReceived")  # Assuming dateReceived may be missing in some cases
            client_id = "WA10018"

            if not message or not phone:
                print("error""Incomplete message data")
                return jsonify(error="Incomplete message data")

            return mainhandler(phone, message, client_id)
             
        # return jsonify(success=True)

    except Exception as e:
        error_message = f"Error: {str(e)} in handle_sms"
        return jsonify(error=error_message)

@app.route("/users",methods=['GET'])
def get_users():
    try:
        return users()
        
    except Exception as e:
        error_message = f"Error: {str(e)} in /users"
        return jsonify(error=error_message),400
@app.route("/profile",methods=['POST'])
def get_user_profile():
    try:
        req = request.get_json()
        phone = req.get("msisdn")
        
        return handle_profile(phone)
        
    except Exception as e:
        error_message = f"Error: {str(e)} in /profile"
        return jsonify(error=error_message),400
