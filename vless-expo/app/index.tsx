import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Alert, ActivityIndicator, Modal, TouchableOpacity, Linking } from 'react-native';
import { Wireguard } from 'react-native-wireguard';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Flag to determine if this is GitHub Edition (set via environment variable or build config)
const IS_GITHUB_EDITION = true; // Set to true for GitHub Edition build
const TELEGRAM_CHANNEL = 'https://t.me/YOUR_CHANNEL_HERE'; // Replace with your actual TG channel

export default function App() {
  const [vlessUrl, setVlessUrl] = useState('');
  const [configName, setConfigName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<any[]>([]);
  const [showAdModal, setShowAdModal] = useState(false);

  useEffect(() => {
    loadSavedConfigs();
    
    // Show Telegram ad on every launch for GitHub Edition
    if (IS_GITHUB_EDITION) {
      setTimeout(() => {
        setShowAdModal(true);
      }, 500);
    }
  }, []);

  const loadSavedConfigs = async () => {
    try {
      const configs = await AsyncStorage.getItem('vless_configs');
      if (configs) {
        setSavedConfigs(JSON.parse(configs));
      }
    } catch (error) {
      console.error('Error loading configs:', error);
    }
  };

  const saveConfig = async () => {
    if (!vlessUrl.trim()) {
      Alert.alert('Ошибка', 'Введите VLESS URL');
      return;
    }

    const name = configName.trim() || `Config ${savedConfigs.length + 1}`;
    const newConfigs = [...savedConfigs, { name, url: vlessUrl }];
    
    try {
      await AsyncStorage.setItem('vless_configs', JSON.stringify(newConfigs));
      setSavedConfigs(newConfigs);
      Alert.alert('Успех', 'Конфигурация сохранена');
      setVlessUrl('');
      setConfigName('');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить конфигурацию');
    }
  };

  const connectVPN = async (url: string) => {
    if (!url) {
      Alert.alert('Ошибка', 'Нет конфигурации для подключения');
      return;
    }

    setIsLoading(true);
    try {
      // Parse VLESS URL and convert to WireGuard config
      // This is a simplified example - you'll need proper VLESS parsing
      const wgConfig = await parseVlessToWireguard(url);
      
      await Wireguard.createInterface({
        name: 'VLess VPN',
        config: wgConfig
      });
      
      await Wireguard.connect('VLess VPN');
      setIsConnected(true);
      Alert.alert('Подключено', 'VPN активен');
    } catch (error: any) {
      Alert.alert('Ошибка подключения', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectVPN = async () => {
    try {
      await Wireguard.disconnect();
      setIsConnected(false);
      Alert.alert('Отключено', 'VPN деактивирован');
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    }
  };

  const deleteConfig = async (index: number) => {
    const newConfigs = savedConfigs.filter((_, i) => i !== index);
    try {
      await AsyncStorage.setItem('vless_configs', JSON.stringify(newConfigs));
      setSavedConfigs(newConfigs);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить конфигурацию');
    }
  };

  const openTelegramChannel = () => {
    Linking.openURL(TELEGRAM_CHANNEL);
    setShowAdModal(false);
  };

  const closeAdModal = () => {
    setShowAdModal(false);
  };

  // Simplified VLESS to WireGuard conversion (needs proper implementation)
  const parseVlessToWireguard = async (vlessUrl: string): Promise<string> => {
    // This is a placeholder - implement proper VLESS parsing
    // You may need to use a server or additional library for full VLESS support
    return `
[Interface]
PrivateKey = YOUR_PRIVATE_KEY
Address = 10.0.0.2/32
DNS = 8.8.8.8

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = server.example.com:51820
AllowedIPs = 0.0.0.0/0
`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VLess Hunter</Text>
        <Text style={styles.subtitle}>
          {IS_GITHUB_EDITION ? 'GitHub Edition (X-Ray Core)' : 'Development Build with Native VPN'}
        </Text>
        {IS_GITHUB_EDITION && (
          <View style={styles.editionBadgeInline}>
            <Text style={styles.editionBadgeTextInline}>GITHUB EDITION</Text>
          </View>
        )}
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Статус: {isConnected ? '🟢 Подключено' : '🔴 Отключено'}
        </Text>
        {isLoading && <ActivityIndicator size="large" color="#4CAF50" />}
      </View>

      <View style={styles.buttonContainer}>
        {!isConnected ? (
          <Button 
            title="Подключить VPN" 
            onPress={() => connectVPN(vlessUrl)}
            disabled={isLoading || !vlessUrl}
          />
        ) : (
          <Button 
            title="Отключить VPN" 
            onPress={disconnectVPN}
            color="#f44336"
          />
        )}
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Добавить конфигурацию</Text>
        <TextInput
          style={styles.input}
          placeholder="Название конфигурации"
          value={configName}
          onChangeText={setConfigName}
        />
        <TextInput
          style={[styles.input, styles.urlInput]}
          placeholder="vless://uuid@host:port?..."
          value={vlessUrl}
          onChangeText={setVlessUrl}
          multiline
        />
        <Button title="Сохранить" onPress={saveConfig} />
      </View>

      <View style={styles.configsSection}>
        <Text style={styles.sectionTitle}>Сохраненные конфигурации</Text>
        {savedConfigs.length === 0 ? (
          <Text style={styles.emptyText}>Нет сохраненных конфигураций</Text>
        ) : (
          savedConfigs.map((config: any, index: number) => (
            <View key={index} style={styles.configItem}>
              <View style={styles.configInfo}>
                <Text style={styles.configName}>{config.name}</Text>
                <Text style={styles.configUrl} numberOfLines={1}>
                  {config.url.substring(0, 50)}...
                </Text>
              </View>
              <View style={styles.configActions}>
                <Button 
                  title="Подключить" 
                  onPress={() => connectVPN(config.url)}
                  disabled={isLoading}
                />
                <Button 
                  title="Удалить" 
                  onPress={() => deleteConfig(index)}
                  color="#f44336"
                />
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Информация</Text>
        <Text style={styles.infoText}>
          Это Development Build с поддержкой нативных модулей.
          Для создания APK используйте: {"\n"}
          {"\n"}eas build --profile development --platform android{"\n"}
          {"\n"}Для production сборки:{"\n"}
          eas build --profile production --platform android
        </Text>
      </View>

      {/* GitHub Edition Ad Modal */}
      {IS_GITHUB_EDITION && (
        <Modal
          visible={showAdModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeAdModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.editionBadge}>
                <Text style={styles.editionBadgeText}>GITHUB EDITION</Text>
              </View>
              
              <Text style={styles.modalTitle}>📢 Поддержи проект!</Text>
              
              <Text style={styles.modalText}>
                Подпишись на наш Telegram канал, чтобы получать обновления,
                новые конфигурации и техническую поддержку!
              </Text>
              
              <TouchableOpacity
                style={styles.telegramButton}
                onPress={openTelegramChannel}
              >
                <Text style={{ fontSize: 24 }}>✈️</Text>
                <Text style={styles.telegramButtonText}>Подписаться</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeAdModal}
              >
                <Text style={styles.closeButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 5,
  },
  editionBadgeInline: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  editionBadgeTextInline: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  inputSection: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#0f3460',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  urlInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  configsSection: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyText: {
    color: '#a0a0a0',
    textAlign: 'center',
    padding: 20,
  },
  configItem: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  configInfo: {
    marginBottom: 10,
  },
  configName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  configUrl: {
    color: '#a0a0a0',
    fontSize: 12,
    marginTop: 5,
  },
  configActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoSection: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  infoText: {
    color: '#a0a0a0',
    lineHeight: 22,
  },
  // GitHub Edition Ad Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  telegramButton: {
    backgroundColor: '#0088cc',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  telegramButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#0f3460',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#a0a0a0',
    fontSize: 16,
    fontWeight: '600',
  },
  editionBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  editionBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
