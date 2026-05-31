import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface TarotCard {
  name: string;
  type: "Major Arcana" | "Minor Arcana";
  direction: "Upright" | "Reversed";
  pastMeaning: string;
  presentMeaning: string;
  futureMeaning: string;
}

const tarotDeck: TarotCard[] = [
  {
    name: "The Fool",
    type: "Major Arcana",
    direction: "Upright",
    pastMeaning: "You recently began a new journey or took a leap of faith, breaking free from old constraints.",
    presentMeaning: "You are currently standing at a crossroads. Embrace spontaneity and trust where the universe leads you.",
    futureMeaning: "An unexpected opportunity will arise soon. Keep an open mind and don't let fear hold you back.",
  },
  {
    name: "The Magician",
    type: "Major Arcana",
    direction: "Upright",
    pastMeaning: "Your past success came from high determination, utilizing all tools and resources available to you.",
    presentMeaning: "You hold the absolute power to manifest your desires right now. Focus your intentions carefully.",
    futureMeaning: "You will master a new skill or launch a highly successful project that elevates your career.",
  },
  {
    name: "The High Priestess",
    type: "Major Arcana",
    direction: "Upright",
    pastMeaning: "You relied on deep secrets or kept your plans private, trusting your inner voice to navigate storms.",
    presentMeaning: "Look beyond the surface level. The answers you seek reside within your intuition—not outside.",
    futureMeaning: "Secrets will be revealed. A deep spiritual awakening will guide you through upcoming decisions.",
  },
  {
    name: "The Empress",
    type: "Major Arcana",
    direction: "Upright",
    pastMeaning: "A period of security, creative abundance, and nurturing relationships laid your current foundation.",
    presentMeaning: "You are in a phase of growth and abundance. Connect with nature and let your creative ideas flow.",
    futureMeaning: "New growth is coming—this could mean a new business venture, family additions, or deep emotional fulfillment.",
  },
  {
    name: "The Emperor",
    type: "Major Arcana",
    direction: "Upright",
    pastMeaning: "You established structure and rules, gaining control over chaotic aspects of your life.",
    presentMeaning: "You need to bring order, structure, and discipline to your current tasks to ensure their stability.",
    futureMeaning: "You will achieve a position of high authority or leadership, successfully organizing complex systems.",
  },
];

export const DailyTarotDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [gameState, setGameState] = useState<"intro" | "shuffling" | "selecting" | "revealed">("intro");
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [activeTab, setActiveTab] = useState<"past" | "present" | "future">("past");

  const startShuffle = () => {
    setGameState("shuffling");
    setTimeout(() => {
      setGameState("selecting");
    }, 1500);
  };

  const drawCards = () => {
    // Pick 3 random distinct cards from deck
    const shuffled = [...tarotDeck].sort(() => 0.5 - Math.random());
    setSelectedCards(shuffled.slice(0, 3));
    setGameState("revealed");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Tarot</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Tap into the spiritual frequencies of the cards. Focus on your question, shuffle the deck, and draw your Past-Present-Future alignment spread.
        </Text>

        {/* Intro State */}
        {gameState === "intro" && (
          <View style={styles.centeredBlock}>
            <View style={styles.magicalCircle}>
              <MaterialIcons name="auto-awesome" size={48} color="#7c3aed" />
            </View>
            <Text style={styles.magicalHeading}>Consult the Tarot Oracle</Text>
            <Text style={styles.magicalDesc}>
              Before you shuffle, take a deep breath. Focus your energy entirely on your query.
            </Text>

            <TouchableOpacity onPress={startShuffle} style={styles.magicalBtn}>
              <LinearGradient
                colors={["#7c3aed", "#db2777"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.btnText}>Shuffle Cosmic Deck</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Shuffling State */}
        {gameState === "shuffling" && (
          <View style={styles.centeredBlock}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.shufflingText}>Channeling metaphysical layouts...</Text>
          </View>
        )}

        {/* Selecting State */}
        {gameState === "selecting" && (
          <View style={styles.centeredBlock}>
            <View style={styles.cardsRow}>
              {Array(3).fill(null).map((_, idx) => (
                <View key={idx} style={styles.cardBack}>
                  <LinearGradient
                    colors={["#4c1d95", "#7c3aed"]}
                    style={styles.cardBackGradient}
                  >
                    <MaterialIcons name="auto-awesome" size={24} color="rgba(255,255,255,0.4)" />
                  </LinearGradient>
                </View>
              ))}
            </View>
            <Text style={styles.deckPrompt}>The deck is charged and aligned.</Text>

            <TouchableOpacity onPress={drawCards} style={styles.drawBtn}>
              <Text style={styles.drawBtnText}>Draw 3 Cards Spread</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Revealed State */}
        {gameState === "revealed" && selectedCards.length === 3 && (
          <View>
            {/* 3 cards visual deck display */}
            <View style={styles.cardsRow}>
              {selectedCards.map((card, idx) => {
                const label = idx === 0 ? "PAST" : idx === 1 ? "PRESENT" : "FUTURE";
                const isCurrent = (idx === 0 && activeTab === "past") || 
                                  (idx === 1 && activeTab === "present") || 
                                  (idx === 2 && activeTab === "future");
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setActiveTab(idx === 0 ? "past" : idx === 1 ? "present" : "future")}
                    style={[styles.drawnCard, isCurrent && styles.drawnCardActive]}
                  >
                    <LinearGradient
                      colors={["#fef3c7", "#fffbeb"]}
                      style={styles.drawnCardGradient}
                    >
                      <Text style={styles.cardLabel}>{label}</Text>
                      <MaterialIcons name="star" size={16} color="#d97706" />
                      <Text style={styles.cardTitle}>{card.name}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Reading description cards */}
            <View style={styles.readingCard}>
              <View style={styles.tabContainer}>
                {["past", "present", "future"].map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab as any)}
                      style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                    >
                      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                        {tab.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.selectedCardHeader}>
                {activeTab === "past" ? "The Past:" : activeTab === "present" ? "The Present:" : "The Future:"} {selectedCards[activeTab === "past" ? 0 : activeTab === "present" ? 1 : 2].name}
              </Text>
              <Text style={styles.cardMetaType}>
                {selectedCards[activeTab === "past" ? 0 : activeTab === "present" ? 1 : 2].type} • {selectedCards[0].direction}
              </Text>

              <Text style={styles.readingDesc}>
                {activeTab === "past" && selectedCards[0].pastMeaning}
                {activeTab === "present" && selectedCards[1].presentMeaning}
                {activeTab === "future" && selectedCards[2].futureMeaning}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setGameState("intro")} style={styles.resetBtn}>
              <MaterialIcons name="refresh" size={18} color="#64748b" />
              <Text style={styles.resetBtnText}>Perform New Reading</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 28,
    textAlign: "center",
  },
  centeredBlock: {
    alignItems: "center",
    marginTop: 40,
  },
  magicalCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(124,58,237,0.08)",
    borderWidth: 2,
    borderColor: "rgba(124,58,237,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  magicalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  magicalDesc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  magicalBtn: {
    width: "80%",
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientBtn: {
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
  shufflingText: {
    fontSize: 14,
    color: "#7c3aed",
    fontWeight: "bold",
    marginTop: 16,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 28,
  },
  cardBack: {
    width: "30%",
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  cardBackGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#db2777",
    borderRadius: 16,
  },
  deckPrompt: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "bold",
    marginBottom: 20,
  },
  drawBtn: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 2,
  },
  drawBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  drawnCard: {
    width: "30%",
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(148,163,184,0.15)",
    elevation: 2,
  },
  drawnCardActive: {
    borderColor: "#d97706",
    elevation: 6,
  },
  drawnCardGradient: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#d97706",
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 4,
  },
  readingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#7c3aed",
  },
  selectedCardHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardMetaType: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 0.5,
    marginTop: 2,
    marginBottom: 12,
  },
  readingDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    gap: 8,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
});
