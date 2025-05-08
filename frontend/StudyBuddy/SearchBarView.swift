import SwiftUI

struct SearchBarView: View {
    @Binding var searchText: String
    var placeholder: String

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            HStack(alignment: .center, spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 18, height: 18)
                    .foregroundColor(.gray)

                TextField(placeholder, text: $searchText)
                    .foregroundColor(.black)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
            }
            .padding(.horizontal, 13)
            .padding(.vertical, 10.5)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.black.opacity(0.04))
            .cornerRadius(162)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
    }
}

#Preview {
    SearchBarView(searchText: .constant(""), placeholder: "Search...")
}
