// import ScreenHeader from "@/components/screenHeader";
// import { theme } from "@/styles/theme";
// import { useRouter } from "expo-router";
// import React from "react";
// import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export default function SignOutConfirmationModal(setSignOutModalVisible) {
//   const router = useRouter();
// const handleSignOut = () => {
//   setSignOutModalVisible(false);
//   // Add your existing sign-out logic here
//   // Example: clearing auth tokens, resetting store, etc.
// };

//   return (
// <Modal
//   transparent
//   animationType="fade"
//   visible={signOutModalVisible}
//   onRequestClose={() => setSignOutModalVisible(false)}
//   statusBarTranslucent
// >
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <Text style={styles.modalTitle}>Confirm Sign Out</Text>
//       <Text style={styles.modalText}>
//         Are you sure you want to sign out of your account?
//       </Text>

//       <View style={styles.modalButtons}>
//         <TouchableOpacity
//           style={[styles.modalButton, styles.cancelButton]}
//           onPress={() => setSignOutModalVisible(false)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.modalButton, styles.deleteButton]}
//           onPress={handleSignOut} // your existing sign out function
//           activeOpacity={0.8}
//         >
//           <Text style={styles.deleteButtonText}>Sign Out</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

//   );
// }
// const styles = StyleSheet.create({
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
 
//   emptyStateButton: {
//     backgroundColor: theme.color.brand,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   emptyStateButtonText: {
//     color: theme.color.white,
//     fontFamily: theme.font.semiBold,
//     fontSize: 16,
//   },
//   listContent: {
//     paddingVertical: 16,
//   },
//   container: {
//     gap: 16,
//     marginBottom: 16,
//   },
//   card: {
//     backgroundColor: theme.color.white,
//     borderRadius: 20,
//   },
//   quoteSection: {
//     backgroundColor: '#F3EAD8',
//     padding: 20,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//     gap: 8,
//   },
//   quote: {
//     fontSize: 16,
//     fontFamily: theme.font.semiBold,
//     color: '#4E3B18',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   reference: {
//     fontSize: 14,
//     fontFamily: theme.font.regular,
//     color: '#4E3B18',
//     textAlign: 'center',
//   },

//   actions: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   actionButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: '#0000004D',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   modalContent: {
//     // width: 380,
//     // height: 408,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 30,
//     gap: 16,
//     // marginHorizontal: 20,
//   },
//   modalTitle: {
//     fontWeight: '700',
//     textAlign: "center",
//     fontSize: 18,
//     color: "#1a1a1a",
//     fontFamily: theme.font.bold,
//   },
//   modalText: {
//     fontSize: 14,
//     fontFamily: theme.font.semiBold,
//     color: '#1A1A1A',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   modalButtons: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: 'space-between',
//     gap: 12
//   },
//   modalButton: {
//     // flex: 1,
//     padding: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     // minHeight: 50,
//   },
//   cancelButton: {
//     borderColor: "#1a1a1a",
//     borderWidth: 1,
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     fontFamily: theme.font.semiBold,
//     color: '#1a1a1a',
//   },
//   deleteButton: {
//     backgroundColor: '#E55153',
//   },
//   deleteButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontFamily: theme.font.semiBold,
//   },
// });
