import { useEffect, useCallback, useRef, useState } from "react";
import VictoryVideo from "../VictoryVideo";
import styles from "./VictoryScreen.module.css";

const AUTO_CLOSE_DELAY = 3000;
const STEP_INTERVAL_MS = 120;        
const MAX_STEPS = 150;     

const formatAmount = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0";

    const rounded = num > 0
        ? Math.ceil(num - Number.EPSILON)
        : Math.round(num + Number.EPSILON);
    const safe = Object.is(rounded, -0) ? 0 : rounded;

    return new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(safe);
};

const VictoryScreen = (props) => {
    const {
        isOpen,
        onClose,
        onVictoryComplete,
        winAmount = 0
    } = props;

    const [displayAmount, setDisplayAmount] = useState(0);
    const hasTriggeredComplete = useRef(false);
    const closeTimerRef = useRef(null);
    const intervalRef = useRef(null);
    const amountRef = useRef(null);

    const handleClose = useCallback(() => {
        if (onClose) onClose();
    }, [onClose]);

    const triggerPopAnimation = useCallback(() => {
        if (!amountRef.current) return;
        amountRef.current.classList.remove(styles["pop"]);
        void amountRef.current.offsetWidth;
        amountRef.current.classList.add(styles["pop"]);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setDisplayAmount(0);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        if (intervalRef.current) clearInterval(intervalRef.current);

        let current = 0;
        const target = winAmount;

        let step = 1;
        let totalSteps = target;
        if (target > MAX_STEPS) {
            step = Math.ceil(target / MAX_STEPS);
            totalSteps = Math.ceil(target / step);
        }

        intervalRef.current = setInterval(() => {
            let newValue = current + step;
            if (newValue >= target) {
                newValue = target;
                setDisplayAmount(newValue);
                triggerPopAnimation();
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                return;
            }
            setDisplayAmount(newValue);
            triggerPopAnimation();
            current = newValue;
        }, STEP_INTERVAL_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isOpen, winAmount, triggerPopAnimation]);

    useEffect(() => {
        if (!isOpen) {
            hasTriggeredComplete.current = false;
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            return;
        }

        if (onVictoryComplete && !hasTriggeredComplete.current) {
            hasTriggeredComplete.current = true;
            onVictoryComplete();
        }

        let steps = winAmount;
        if (winAmount > MAX_STEPS) steps = Math.ceil(winAmount / Math.ceil(winAmount / MAX_STEPS));
        const animationDuration = steps * STEP_INTERVAL_MS;
        const closeDelay = animationDuration + AUTO_CLOSE_DELAY;

        closeTimerRef.current = setTimeout(() => {
            handleClose();
        }, closeDelay);

        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, [isOpen, handleClose, onVictoryComplete, winAmount]);

    if (!isOpen) return null;

    return (
        <div className={styles["victory-screen"]}>
            <VictoryVideo className={styles["victory-video"]} />
            <div className={styles["victory-content"]}>
                <h1 className={styles["victory-title"]}>Ты победил</h1>
                <p ref={amountRef} className={styles["victory-amount"]}>
                    +{formatAmount(displayAmount)} Ар
                </p>
            </div>
        </div>
    );
};

export default VictoryScreen;