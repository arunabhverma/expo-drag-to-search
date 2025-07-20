import { Contact } from "@/mock/contact";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "./Avatar";

interface ContactItemProps {
  contact: Contact;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Avatar name={contact.name} />
      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: theme.colors.text }]}
        >
          {contact.name}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.phone,
            { color: Color(theme.colors.text).alpha(0.4).toString() },
          ]}
        >
          {contact.phone}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  phone: {
    fontSize: 13,
  },
});
