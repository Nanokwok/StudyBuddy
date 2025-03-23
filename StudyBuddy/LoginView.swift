//
//  LoginView.swift
//  StudyBuddy
//
//  Created by Chananthida Sopaphol on 23/3/2568 BE.
//

import SwiftUI

struct LoginView: View {
    @State private var firstName: String = ""
    @State private var surname: String = ""
    @State private var mobile: String = ""
    @State private var email: String = ""
    @State private var password: String = ""
    
    var body: some View {
        VStack(alignment: .leading, spacing: 15) {
//            Spacer()
            
            Text("    Create Account")
                .font(.title).bold()
                .foregroundColor(.black)
                .padding(.top, 80)
            
            // Input Fields
            VStack(spacing: 16) {
                HStack {
                    TextField("First Name", text: $firstName)
                        .padding()
                        .frame(height: 50)
                        .background(Color(.systemGray6))
                        .cornerRadius(23)
                        .autocapitalization(.words)
                        .disableAutocorrection(true)
                    
                    TextField("Surname", text: $surname)
                        .padding()
                        .frame(height: 50)
                        .background(Color(.systemGray6))
                        .cornerRadius(23)
                        .autocapitalization(.words)
                        .disableAutocorrection(true)
                }
                .padding(.horizontal, 20)
                
                TextField("Mobile Phone (Optional)", text: $mobile)
                    .padding()
                    .frame(height: 50)
                    .background(Color(.systemGray6))
                    .cornerRadius(23)
                    .keyboardType(.phonePad)
                    .padding(.horizontal, 20)
                
                TextField("Email Address", text: $email)
                    .padding()
                    .frame(height: 50)
                    .background(Color(.systemGray6))
                    .cornerRadius(23)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                    .padding(.horizontal, 20)
                
                SecureField("Password", text: $password)
                    .padding()
                    .frame(height: 50)
                    .background(Color(.systemGray6))
                    .cornerRadius(23)
                    .padding(.horizontal, 20)
            }
            
            // Create Account Button
            Button(action: {
                // Handle account creation
            }) {
                Text("Create Account")
                    .bold()
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(23)
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
            }
            
            // OR Divider
            HStack {
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color(.systemGray4))
                Text("or")
                    .foregroundColor(.gray)
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color(.systemGray4))
            }
            .padding(.horizontal, 20)
            
            // Google Sign Up Button
            Button(action: {
                // Handle Google Sign-Up
            }) {
                HStack {
                    Image("google") // Replace with Google logo asset
                        .resizable()
                        .frame(width: 20, height: 20)
                        .padding(.leading, 16)
                    
                    Text("Sign up with Google")
                        .bold()
                        .frame(maxWidth: .infinity, alignment: .center)
                    
                    Spacer()
                }
                .frame(maxWidth: .infinity)
                .frame(height: 50)
                .background(Color.white)
                .overlay(
                    RoundedRectangle(cornerRadius: 23)
                        .stroke(Color.gray, lineWidth: 1)
                )
                .padding(.horizontal, 20)
            }
            
            Spacer()
        }
    }
}

#Preview {
    LoginView()
}
