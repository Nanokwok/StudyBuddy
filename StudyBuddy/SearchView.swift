import SwiftUI

let subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics", "History", "Geography", "English", "Psychology"]

struct SearchView: View {
    @State private var searchText: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Search Bar
            SearchBarView(searchText: $searchText, placeholder: "Search by course or subject")

            // Tag List
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(subjects, id: \.self) { subject in
                        SearchTagView(text: subject, searchText: $searchText)
                    }
                }
                .padding(.horizontal, 16)
            }
            
            // People List
            ForEach(1...5, id: \.self) { index in
                UserProfileView(
                    name: "Sawasdee krab",
                    description: "Engineering, Software and Knowledge Engineering",
                    courses: ["Mathematics", "Physics", "Chemistry"]
                )
            }

            Spacer()
        }
        .padding(.top, 20)
    }
}

// MARK: - Reusable User Profile View
struct UserProfileView: View {
    var name: String
    var description: String
    var courses: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .center, spacing: 12) {
                ProfileDetailView(name: name, description: description)
                Spacer()
                Button(action: {}) {
                    Image(systemName: "person.fill.badge.plus")
                        .foregroundColor(.white)
                        .frame(width: 40, height: 40)
                        .background(Color.blue)
                        .cornerRadius(10)
                }
            }

            // Course Tags
            FlowLayout(spacing: 8) {
                ForEach(courses, id: \.self) { course in
                    CourseTagView(text: course)
                }
            }
            .padding(.top, 8)
        }
        .padding(16)
        .background(Color.white)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color.black.opacity(0.12), lineWidth: 1)
        )
        .padding(.horizontal, 16)
        .padding(.vertical, 4)
    }
}

// MARK: - Preview
#Preview {
    SearchView()
}
