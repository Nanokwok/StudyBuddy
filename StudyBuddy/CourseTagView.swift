import SwiftUI

struct CourseTagView: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.footnote)
            .foregroundColor(Color(red: 0.23, green: 0.39, blue: 0.93))
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(Color(red: 0.23, green: 0.39, blue: 0.93).opacity(0.1))
            .cornerRadius(10)
    }
}

#Preview {
    CourseTagView(text: "Mathematics")
}
