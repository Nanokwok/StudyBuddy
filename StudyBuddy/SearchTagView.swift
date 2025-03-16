import SwiftUI

struct SearchTagView: View {
    var text: String
    @Binding var searchText: String
    @State private var isSelected: Bool = false

    var body: some View {
        HStack(alignment: .center, spacing: 4) {
            Text(text)
                .font(.system(size: 15, weight: .bold))
                .multilineTextAlignment(.center)
                .foregroundColor(.black)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 9)
        .background(.white)
        .cornerRadius(32)
        .overlay(
            RoundedRectangle(cornerRadius: 32)
                .stroke(isSelected ? Color(red: 0.23, green: 0.39, blue: 0.93) : Color.black.opacity(0.12), lineWidth: 1)
        )
        .onTapGesture {
            searchText = text
        }
        .onChange(of: searchText) { newValue in
            isSelected = (newValue == text)
        }
    }
}

#Preview {
    SearchTagView(text: "Mathematics", searchText: .constant(""))
}
