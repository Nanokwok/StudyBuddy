//
//  CourseView.swift
//  StudyBuddy
//
//  Created by Chananthida Sopaphol on 23/3/2568 BE.
//

import SwiftUI

struct CourseView: View {
    @State private var searchText: String = ""
    @State private var selectedCourses: Set<String> = []
    
    let courses = [
        "Mathematics",
        "Nuclear Engineering",
        "Software Design",
        "Computer Programming I",
        "Physics II",
        "Service Design",
        "Mobile Dev",
        "Thai Language"
    ]

    var filteredCourses: [String] {
        if searchText.isEmpty {
            return courses
        } else {
            return courses.filter { $0.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text("    Seclect Your Courses")
                .font(.title2).bold()
                .foregroundColor(.black)
                .padding(.top, 35)
            // Search Bar
            SearchBarView(searchText: $searchText, placeholder: "Search Courses")
            
            // Course List
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(filteredCourses, id: \.self) { course in
                        CourseRow(course: course, isSelected: selectedCourses.contains(course)) {
                            if selectedCourses.contains(course) {
                                selectedCourses.remove(course)
                            } else {
                                selectedCourses.insert(course)
                            }
                        }
                    }
                }
                .padding(.horizontal, 15)
            }

            // Continue Button
            Button(action: {
                // Handle Continue Action
            }) {
                Text("Continue")
                    .bold()
                    .frame(maxWidth: .infinity)
                    .frame(height: 55)
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(23)
                    .padding(.horizontal, 15)
            }
        }
    }
}

// Course Row Component
struct CourseRow: View {
    let course: String
    let isSelected: Bool
    var onTap: () -> Void

    var body: some View {
        HStack {
            Text(course)
                .foregroundColor(.black)
            Spacer()
            if isSelected {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(.blue)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(isSelected ? Color.blue.opacity(0.2) : Color.white)
        .cornerRadius(12)
        .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.25), lineWidth: 1) // Thicker border
                )
        .onTapGesture {
            onTap()
        }
    }
}

#Preview {
    CourseView()
}
