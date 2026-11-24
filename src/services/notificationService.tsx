
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração de como as notificações serão exibidas
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export class NotificationService {

    // Solicita permissão para enviar notificações
    static async solicitarPermissao(): Promise<boolean> {
        const { status: statusAtual } =
            await Notifications.getPermissionsAsync();

        let statusFinal = statusAtual;

        if (statusAtual !== 'granted') {
            const { status } =
                await Notifications.requestPermissionsAsync();

            statusFinal = status;
        }

        if (statusFinal !== 'granted') {
            console.log('Permissão para notificações não concedida.');
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Notificações gerais',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#47d406',
            });
        }

        return true;
    }

    // Envia uma notificação local imediatamente
    static async enviar(
        titulo: string,
        mensagem: string
    ): Promise<void> {
        const permitido = await this.solicitarPermissao();

        if (!permitido) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: titulo,
                body: mensagem,
                sound: true,
            },
            trigger: null,
        });
    }
}
