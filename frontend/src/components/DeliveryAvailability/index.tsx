import { useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
    Container,
    DaysContainer,
    DayCard,
    DayLabel,
    DateLabel,
    CheckIcon,
    MotoboyContainer,
    MotoboyImage
} from './style';

moment.locale('pt-br');

interface Schedule {
    id: string;
    day_of_week: string;
    is_closed: boolean;
    opening_time: string | null;
    closing_time: string | null;
    lunch_break_start: string | null;
    lunch_break_end: string | null;
    created_at: string;
    updated_at: string;
}

interface DeliveryAvailabilityProps {
    schedules: Schedule[];
    isPDP?: boolean;
}

const DAY_OF_WEEK_MAP: { [key: string]: number } = {
    'SUNDAY': 0,
    'MONDAY': 1,
    'TUESDAY': 2,
    'WEDNESDAY': 3,
    'THURSDAY': 4,
    'FRIDAY': 5,
    'SATURDAY': 6
};

export function DeliveryAvailability({ schedules, isPDP = false }: DeliveryAvailabilityProps) {
    const deliveryDays = useMemo(() => {
        const today = moment();
        const days = [];

        for (let i = 0; i < 7; i++) {
            const date = moment(today).add(i, 'days');
            const dayOfWeek = date.day(); // 0-6 (Sunday-Saturday)
            
            // Find schedule for this day
            const schedule = schedules.find(s => {
                const scheduleDayNumber = DAY_OF_WEEK_MAP[s.day_of_week];
                return scheduleDayNumber === dayOfWeek;
            });

            const isAvailable = !!(schedule && !schedule.is_closed);
            
            // Get day label
            let dayLabel = '';
            if (i === 0) {
                dayLabel = 'HOJE';
            } else if (i === 1) {
                dayLabel = 'AMANHÃ';
            } else {
                dayLabel = date.format('ddd').toUpperCase();
            }

            days.push({
                date: date.format('DD/MM'),
                dayLabel,
                isAvailable,
                isToday: i === 0
            });
        }

        return days;
    }, [schedules]);

    return (
        <Container isPDP={isPDP}>
            <MotoboyContainer>
                <MotoboyImage src={require('../../assets/images/motoboy.png')} alt="Motoboy" />
            </MotoboyContainer>
            <DaysContainer isPDP={isPDP}>
                {deliveryDays.map((day, index) => (
                    <DayCard key={index} isAvailable={day.isAvailable} isPDP={isPDP}>
                        {day.isAvailable && (
                            <CheckIcon>
                                <FontAwesomeIcon icon={faCheck as any} />
                            </CheckIcon>
                        )}
                        <DayLabel>{day.dayLabel}</DayLabel>
                        <DateLabel>{day.date}</DateLabel>
                    </DayCard>
                ))}
            </DaysContainer>
        </Container>
    );
}
