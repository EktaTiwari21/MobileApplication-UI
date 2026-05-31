import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAstroGPTStore, ChatMessage } from "../../store/useAstroGPTStore";
import { useKundaliStore } from "../../store/useKundaliStore";

const { width } = Dimensions.get("window");

export const AstroChatScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [inputVal, setInputVal] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const { activeKundali } = useKundaliStore();
  const { messages, isLoading, error, sendMessage, clearChat } = useAstroGPTStore();

  // Floating Pulse Animation for the glowing bot avatar
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInputVal("");
    await sendMessage(text, activeKundali);
    // Scroll to end
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const suggestedPrompts = [
    "How will my career be in 2026?",
    "Is my Rahu dasha bad?",
    "Which gemstone fits me?",
    "Give me Vastu home remedies.",
  ];

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isBot = item.sender === "bot";
    return (
      <View
        style={[
          styles.messageRow,
          isBot ? styles.botRow : styles.userRow,
        ]}
      >
        {isBot && (
          <View style={styles.botAvatarMini}>
            <MaterialIcons name="auto-awesome" size={14} color="#ffffff" />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isBot ? styles.botBubble : styles.userBubble,
          ]}
        >
          <Text style={isBot ? styles.botText : styles.userText}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
        >
          <MaterialIcons name="arrow-back" size={24} color="#475569" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Animated.View style={[styles.glowWrapper, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={["#7c3aed", "#db2777"]}
              style={styles.botAvatarGlow}
            >
              <MaterialIcons name="auto-awesome" size={18} color="#ffffff" />
            </LinearGradient>
          </Animated.View>
          <View>
            <Text style={styles.headerTitle}>AstroGPT</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Cosmic AI Astrologer</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <MaterialIcons name="refresh" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* No Context Warning Card */}
        {!activeKundali ? (
          <View style={styles.noContextContainer}>
            <View style={styles.noContextCard}>
              <LinearGradient
                colors={["rgba(124,58,237,0.1)", "rgba(219,39,119,0.05)"]}
                style={styles.noContextGradient}
              >
                <MaterialIcons name="auto-graph" size={48} color="#7c3aed" style={{ marginBottom: 12 }} />
                <Text style={styles.noContextTitle}>Birth Chart Needed</Text>
                <Text style={styles.noContextDesc}>
                  Please generate your Vedic Birth Chart first. AstroGPT reads your specific chart degrees, planet locations, and Dashas to answer your queries accurately!
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Charts")}
                  style={styles.generateBtn}
                >
                  <LinearGradient
                    colors={["#7c3aed", "#4c1d95"]}
                    style={styles.generateBtnGrad}
                  >
                    <Text style={styles.generateBtnText}>Generate Chart</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        ) : (
          /* Chat List */
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={
              isLoading ? (
                <View style={styles.typingRow}>
                  <View style={styles.botAvatarMini}>
                    <MaterialIcons name="auto-awesome" size={14} color="#ffffff" />
                  </View>
                  <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
                    <ActivityIndicator size="small" color="#7c3aed" />
                    <Text style={styles.typingText}>Reading birth blueprint...</Text>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Input Panel with Suggested Prompts */}
        {activeKundali && (
          <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            {/* Suggested Prompts Grid */}
            {messages.length === 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.suggestedScroll}
                contentContainerStyle={styles.suggestedContainer}
              >
                {suggestedPrompts.map((prompt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSend(prompt)}
                    style={styles.promptPill}
                  >
                    <Text style={styles.promptText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={inputVal}
                onChangeText={setInputVal}
                placeholder="Ask about career, love, or remedies..."
                placeholderTextColor="#94a3b8"
                onSubmitEditing={() => handleSend(inputVal)}
              />
              <TouchableOpacity
                onPress={() => handleSend(inputVal)}
                style={styles.sendButton}
                disabled={isLoading || !inputVal.trim()}
              >
                <LinearGradient
                  colors={["#7c3aed", "#db2777"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendGrad}
                >
                  <MaterialIcons name="send" size={20} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.1)",
    backgroundColor: "#ffffff",
  },
  headerBackBtn: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  glowWrapper: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  botAvatarGlow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  clearBtn: {
    padding: 8,
  },
  noContextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  noContextCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    width: "100%",
    overflow: "hidden",
    shadowColor: "#7c3aed",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  noContextGradient: {
    padding: 32,
    alignItems: "center",
  },
  noContextTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  noContextDesc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  generateBtn: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  generateBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  generateBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
    alignItems: "flex-end",
  },
  botRow: {
    alignSelf: "flex-start",
    gap: 8,
  },
  userRow: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginLeft: "20%",
  },
  botAvatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botBubble: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 4,
    shadowColor: "#1e293b",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.08)",
  },
  userBubble: {
    backgroundColor: "#7c3aed",
    borderTopRightRadius: 4,
  },
  botText: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,184,0.1)",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  suggestedScroll: {
    marginBottom: 12,
  },
  suggestedContainer: {
    gap: 8,
    paddingRight: 16,
  },
  promptPill: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.1)",
  },
  promptText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#f1f5f9",
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.1)",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  sendGrad: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
