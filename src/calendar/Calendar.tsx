import * as React from 'react';
import './calendar.css';

interface CalendarProps {
	value?: string | number;
	onChange?: (val: string) => void;
}

const prefix = 'demo-calendar';
const FILL_DEAFULT_KEY = 'default';

const MONTHS = [
	'一月',
	'二月',
	'三月',
	'四月',
	'五月',
	'六月',
	'七月',
	'八月',
	'九月',
	'十月',
	'十一月',
	'十二月',
];
const WEEKS = ['日', '一', '二', '三', '四', '五', '六'];
const cDate = new Date();

const Calendar: React.FC<CalendarProps> = () => {
	const [currentDate, serCurrentDate] = React.useState(cDate);

	const cYear = currentDate.getFullYear();
	const cMonth = currentDate.getMonth();
	// const [cMonth, serCurrentMonth] = React.useState(cMonth);

	//当前月最后一天是几号
	const cMonthLastDay = new Date(cYear, cMonth + 1, -1);
	const dayCount = cMonthLastDay.getDate() + 1;

	//当前月第一天是周几
	const firstDayWeek = new Date(cYear, cMonth, 1).getDay();

	let days: (number | undefined)[] = new Array(dayCount)
		.fill(FILL_DEAFULT_KEY)
		.map((_t, i) => i + 1);
	new Array(firstDayWeek)
		.fill(FILL_DEAFULT_KEY)
		.forEach((_t) => days.unshift(undefined));

	const changeMonth = React.useCallback(
		(e: React.MouseEvent) => {
			const value = e.currentTarget.getAttribute('data-value');
			const isPrev = value === 'prev';
			const changedMonth = isPrev ? cMonth - 1 : cMonth + 1;
			const newDate = new Date(cYear, changedMonth, 1);
			serCurrentDate(newDate);
		},
		[cMonth, cYear]
	);

	return (
		<div className={prefix}>
			<div className={`${prefix}-header`}>
				<div className={`${prefix}-year`}>
					<div
						className={`${prefix}-prev-month`}
						data-value="prev"
						onClick={changeMonth}
					>
						上一月
					</div>
					{cYear}
					<div
						className={`${prefix}-next-month`}
						data-value="next"
						onClick={changeMonth}
					>
						下一月
					</div>
				</div>
				<div className={`${prefix}-month`}>{MONTHS[cMonth]}</div>
			</div>
			<div className={`${prefix}-wrapper`}>
				<div className={`${prefix}-weeks`}>
					{WEEKS.map((w) => (
						<div className={`${prefix}-week`}>{w}</div>
					))}
				</div>
				<div className={`${prefix}-days`}>
					{days.map((d, i) => (
						<div key={`${d}-${i}`} className={`${prefix}-day`}>
							{d}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Calendar;
