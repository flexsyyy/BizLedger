import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FAQScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Toggle FAQ expansion
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Sample FAQ data with questions and answers
  const faqs = [
    {
      id: 1,
      question: "Q1 Where is my data",
      answer: "Your data is securely stored on your device. We also provide backup options to ensure your data is safe."
    },
    {
      id: 2,
      question: "Q2 How to backup my data",
      answer: "To backup your data, go to the Profile menu and select 'Backup'. Follow the instructions to create a backup file."
    },
    {
      id: 3,
      question: "Q3 How to restore data",
      answer: "To restore your data, go to the Profile menu, select 'Backup', then choose the 'Restore' option and select your backup file."
    },
    {
      id: 4,
      question: "Q4 How to change password",
      answer: "You can change your password by going to the Profile menu and selecting 'Change password'. Enter your current password and then your new password."
    },
    {
      id: 5,
      question: "Q5 How to add new account",
      answer: "To add a new account, go to the Accounts section and tap on the '+' button. Fill in the required details to create a new account."
    },
    {
      id: 6,
      question: "Q6 How to delete account",
      answer: "To delete an account, go to the Accounts section, select the account you want to delete, and tap on the 'Delete' option."
    },
    {
      id: 7,
      question: "Q7 How to contact support",
      answer: "You can contact our support team by sending an email to support@bizledger.com or by using the 'Contact Us' form in the app."
    },
    {
      id: 8,
      question: "Q8 How to update app",
      answer: "The app will automatically check for updates. If an update is available, you'll be notified. You can also check for updates manually in the app settings."
    }
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <View style={styles.mainContainer}>
        {/* Blue header with FAQ title */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.blueBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.blueBackArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>FAQ</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>

          {faqs.map((faq, index) => (
            <React.Fragment key={faq.id}>
              <View style={styles.faqItem}>
                <Text style={styles.question}>{faq.question}</Text>
                <TouchableOpacity onPress={() => toggleExpand(faq.id)}>
                  <Text style={styles.plusIcon}>{expandedId === faq.id ? '-' : '+'}</Text>
                </TouchableOpacity>
              </View>

              {/* Expanded answer */}
              {expandedId === faq.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              )}

              {index < faqs.length - 1 && <View style={styles.line} />}
            </React.Fragment>
          ))}

          <View style={styles.footer} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center",
    paddingBottom: 20,
  },

  header: {
    backgroundColor: "#03216d",
    height: 95,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  blueBackButton: {
    padding: 5,
  },
  blueBackArrow: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "400",
  },
  headerText: {
    color: "#fff",
    fontSize: 32,
    marginLeft: 15,
    fontWeight: "400",
  },
  footer: {
    backgroundColor: "#03216d",
    height: 95,
    width: "100%",
    marginTop: 20,
  },
  faqItem: {
    width: 355,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  question: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    width: 276,
  },
  plusIcon: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#03216d",
    width: 30,
    height: 30,
    textAlign: "center",
    lineHeight: 28,
  },
  line: {
    height: 1,
    width: 329,
    marginTop: 10,
    backgroundColor: "#d9d9d9",
  },
  answerContainer: {
    width: 355,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  answer: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 22,
  },
});
