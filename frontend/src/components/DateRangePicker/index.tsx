import { useState, useRef, useEffect } from "react";
import moment from "moment";
import {
    Container,
    DateButton,
    PickerModal,
    ModalContent,
    QuickFiltersSection,
    QuickFilterButton,
    CalendarSection,
    CalendarHeader,
    MonthYearSelector,
    NavButton,
    CalendarGrid,
    DayHeader,
    DayCell,
    ModalFooter,
    ClearButton,
    ApplyButton
} from "./style";

interface DateRangePickerProps {
    onDateRangeChange: (startDate: string | null, endDate: string | null, filterType: string) => void;
}

export function DateRangePicker({ onDateRangeChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>("all-dates");
    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);
    const [currentMonth, setCurrentMonth] = useState(moment());
    const [displayText, setDisplayText] = useState("Selecionar Data");
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleQuickFilter = (filterType: string) => {
        setSelectedFilter(filterType);
        
        if (filterType === "all-dates") {
            setStartDate(null);
            setEndDate(null);
            setDisplayText("Selecionar Data");
            onDateRangeChange(null, null, filterType);
            setIsOpen(false);
        } else if (filterType === "today") {
            const today = moment();
            setStartDate(today);
            setEndDate(today);
            setDisplayText(today.format("DD/MM/YYYY"));
            onDateRangeChange(today.format("YYYY-MM-DD"), today.format("YYYY-MM-DD"), filterType);
            setIsOpen(false);
        } else if (filterType === "yesterday") {
            const yesterday = moment().subtract(1, "days");
            setStartDate(yesterday);
            setEndDate(yesterday);
            setDisplayText(yesterday.format("DD/MM/YYYY"));
            onDateRangeChange(yesterday.format("YYYY-MM-DD"), yesterday.format("YYYY-MM-DD"), filterType);
            setIsOpen(false);
        } else if (filterType === "week") {
            const startOfWeek = moment().startOf("week");
            const endOfWeek = moment().endOf("week");
            setStartDate(startOfWeek);
            setEndDate(endOfWeek);
            setDisplayText(`${startOfWeek.format("DD/MM")} - ${endOfWeek.format("DD/MM/YYYY")}`);
            onDateRangeChange(startOfWeek.format("YYYY-MM-DD"), endOfWeek.format("YYYY-MM-DD"), filterType);
            setIsOpen(false);
        }
    };

    const handleDayClick = (day: moment.Moment) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
            setSelectedFilter("custom");
        } else if (day.isBefore(startDate)) {
            setStartDate(day);
        } else {
            setEndDate(day);
        }
    };

    const handleApply = () => {
        if (startDate && endDate) {
            setDisplayText(`${startDate.format("DD/MM")} - ${endDate.format("DD/MM/YYYY")}`);
            onDateRangeChange(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"), "custom");
        } else if (startDate) {
            setDisplayText(startDate.format("DD/MM/YYYY"));
            onDateRangeChange(startDate.format("YYYY-MM-DD"), startDate.format("YYYY-MM-DD"), "custom");
        }
        setIsOpen(false);
    };

    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
        setSelectedFilter("all-dates");
        setDisplayText("Selecionar Data");
        onDateRangeChange(null, null, "all-dates");
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const startOfMonth = currentMonth.clone().startOf("month");
        const endOfMonth = currentMonth.clone().endOf("month");
        const calendarStart = startOfMonth.clone().startOf("week");
        const calendarEnd = endOfMonth.clone().endOf("week");

        const days = [];
        let day = calendarStart.clone();

        while (day.isBefore(calendarEnd, "day")) {
            days.push(day.clone());
            day.add(1, "day");
        }

        return days;
    };

    const isDayInRange = (day: moment.Moment) => {
        if (!startDate || !endDate) return false;
        return day.isBetween(startDate, endDate, "day", "[]");
    };

    const isDaySelected = (day: moment.Moment) => {
        if (!startDate) return false;
        if (startDate && !endDate) return day.isSame(startDate, "day");
        return day.isSame(startDate, "day") || day.isSame(endDate, "day");
    };

    return (
        <Container ref={modalRef}>
            <DateButton onClick={() => setIsOpen(!isOpen)}>
                {displayText}
            </DateButton>
            
            {isOpen && (
                <PickerModal>
                    <ModalContent>
                        <QuickFiltersSection>
                            <QuickFilterButton
                                active={selectedFilter === "all-dates"}
                                onClick={() => handleQuickFilter("all-dates")}
                            >
                                Qualquer data
                            </QuickFilterButton>
                            <QuickFilterButton
                                active={selectedFilter === "today"}
                                onClick={() => handleQuickFilter("today")}
                            >
                                Hoje
                            </QuickFilterButton>
                            <QuickFilterButton
                                active={selectedFilter === "yesterday"}
                                onClick={() => handleQuickFilter("yesterday")}
                            >
                                Ontem
                            </QuickFilterButton>
                            <QuickFilterButton
                                active={selectedFilter === "week"}
                                onClick={() => handleQuickFilter("week")}
                            >
                                Essa semana
                            </QuickFilterButton>
                        </QuickFiltersSection>

                        <CalendarSection>
                            <CalendarHeader>
                                <NavButton onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "month"))}>
                                    ‹
                                </NavButton>
                                <MonthYearSelector>
                                    {currentMonth.format("MMMM YYYY")}
                                </MonthYearSelector>
                                <NavButton onClick={() => setCurrentMonth(currentMonth.clone().add(1, "month"))}>
                                    ›
                                </NavButton>
                            </CalendarHeader>

                            <CalendarGrid>
                                <DayHeader>Dom</DayHeader>
                                <DayHeader>Seg</DayHeader>
                                <DayHeader>Ter</DayHeader>
                                <DayHeader>Qua</DayHeader>
                                <DayHeader>Qui</DayHeader>
                                <DayHeader>Sex</DayHeader>
                                <DayHeader>Sáb</DayHeader>
                                
                                {renderCalendar().map((day, index) => (
                                    <DayCell
                                        key={index}
                                        onClick={() => handleDayClick(day)}
                                        isCurrentMonth={day.month() === currentMonth.month()}
                                        isSelected={isDaySelected(day)}
                                        isInRange={isDayInRange(day)}
                                        isToday={day.isSame(moment(), "day")}
                                    >
                                        {day.date()}
                                    </DayCell>
                                ))}
                            </CalendarGrid>
                        </CalendarSection>

                        <ModalFooter>
                            <ClearButton onClick={handleClear}>
                                Limpar
                            </ClearButton>
                            <ApplyButton onClick={handleApply}>
                                Aplicar
                            </ApplyButton>
                        </ModalFooter>
                    </ModalContent>
                </PickerModal>
            )}
        </Container>
    );
}
