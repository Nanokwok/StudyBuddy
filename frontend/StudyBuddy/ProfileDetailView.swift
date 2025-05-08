import SwiftUI

struct ProfileDetailView: View {
    let name: String
    let description: String

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(name)
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(.black)
            Text(description)
                .font(.system(size: 13))
                .foregroundColor(.black.opacity(0.5))
        }
    }
}
