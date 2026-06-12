import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell 
} from 'recharts';

function App() {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [dateFilter, setDateFilter] = useState('all');
    const [showStats, setShowStats] = useState(true);
    const [editing, setEditing] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [isUSD, setIsUSD] = useState(false);
    const [exchangeRate] = useState(32.5);
    const [showNotifications, setShowNotifications] = useState(false);

    // Sanal Kartlar - Renkleri ve Opaklıkları Aydınlık Moda Tam Uyumlu Hale Getirildi!
    const [wallets, setWallets] = useState([
        { id: 'cash', name: '💵 Nakit Cüzdan', balance: 4500, color: 'linear-gradient(135deg, #2E7D32, #4CAF50)' },
        { id: 'bank', name: '🏦 Banka Hesabı (Ziraat)', balance: 18500, color: 'linear-gradient(135deg, #1565C0, #2196F3)' },
        { id: 'credit', name: '💳 Kredi Kartı (Bonus)', balance: -3200, color: 'linear-gradient(135deg, #C62828, #F44336)' }
    ]);

    // Sabit Giderler ve Abonelikler State'i
    const [subscriptions] = useState([
        { id: 1, name: 'Netflix Premium', price: 230, dueDate: 15, emoji: '🎬' },
        { id: 2, name: 'Spotify Aile', price: 85, dueDate: 22, emoji: '🎵' },
        { id: 3, name: 'YouTube Premium', price: 80, dueDate: 5, emoji: '📺' },
        { id: 4, name: 'Spor Salonu', price: 1200, dueDate: 28, emoji: '💪' }
    ]);

    // Akıllı Kumbara State'i
    const [savingsGoal] = useState({
        name: '💻 Yeni Yazılım Bilgisayarı',
        targetAmount: 45000
    });

    // Bütçe Limitleri Tanımlamaları
    const [budgetLimits] = useState({
        'Market': 3000,
        'Kahve': 500,
        'Yemek': 2000,
        'Eğlence': 1500,
        'Kira': 10000,
        'Fatura': 2500,
        'Ulaşım': 1200
    });

    // Form state'leri
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        isIncome: false,
        walletId: 'cash'
    });

    // Abonelik faturasına kaç gün kaldığını hesaplayan fonksiyon
    const getDaysUntilDue = (dueDay) => {
        const today = new Date();
        const currentDay = today.getDate();
        
        if (dueDay >= currentDay) {
            return dueDay - currentDay;
        } else {
            const lastDayOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            return (lastDayOfThisMonth - currentDay) + dueDay;
        }
    };

    // fetchExpenses fonksiyonu
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/Expenses');
            if (response.ok) {
                const data = await response.json();
                setExpenses(data);
            } else {
                const demoData = [
                    { id: 1, amount: 1000, category: 'Market', description: 'Haftalık alışveriş', isIncome: false, date: new Date().toISOString(), walletId: 'bank' },
                    { id: 2, amount: 5000, category: 'Maaş', description: 'Aylık maaş', isIncome: true, date: new Date().toISOString(), walletId: 'bank' }
                ];
                setExpenses(data || demoData);
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error);
            const demoData = [
                { id: 1, amount: 1000, category: 'Market', description: 'Haftalık alışveriş', isIncome: false, date: new Date().toISOString(), walletId: 'bank' }
            ];
            setExpenses(demoData);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortExpenses = useCallback(() => {
        let filtered = [...expenses];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(expense =>
                expense.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(expense =>
                expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expense.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (dateFilter !== 'all') {
            const today = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(expense => new Date(expense.date) >= filterDate);
                    break;
                case 'week':
                    filterDate.setDate(today.getDate() - 7);
                    filtered = filtered.filter(expense => new Date(expense.date) >= filterDate);
                    break;
                case 'month':
                    filterDate.setMonth(today.getMonth() - 1);
                    filtered = filtered.filter(expense => new Date(expense.date) >= filterDate);
                    break;
                default:
                    break;
            }
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (sortOrder === 'amount-high') return b.amount - a.amount;
            if (sortOrder === 'amount-low') return a.amount - b.amount;
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredExpenses(filtered);
    }, [expenses, selectedCategory, searchTerm, sortOrder, dateFilter]);

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        filterAndSortExpenses();
    }, [filterAndSortExpenses]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const handleEdit = (expense) => {
        setEditing(true);
        setCurrentExpense(expense);
        setFormData({
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            isIncome: expense.isIncome,
            walletId: expense.walletId || 'cash'
        });
        setShowForm(true);
    };

    // Sesli komut fonksiyonu
    const handleVoiceCommand = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Tarayıcınız ses tanımayı desteklemiyor. Lütfen Chrome veya Edge kullanın.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'tr-TR';
        
        alert("Tamam kankam, bu kutuyu kapattığın an konuşmaya başla! \nÖrnek: 'Market 250' veya 'Kahve 80' de.");

        recognition.start();

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            const words = command.split(' ');
            let detectedAmount = null;
            let detectedCategory = '';

            words.forEach(word => {
                const num = parseFloat(word.replace(',', '.'));
                if (!isNaN(num)) {
                    detectedAmount = num;
                } else if (!['lira', 'tl', 'liralık'].includes(word)) {
                    detectedCategory += (detectedCategory ? ' ' : '') + word;
                }
            });

            if (detectedAmount && detectedCategory.trim()) {
                const formattedCategory = detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1);
                setFormData({
                    amount: detectedAmount.toString(),
                    category: formattedCategory,
                    description: `${formattedCategory} için sesli eklenen harcama`,
                    isIncome: false,
                    walletId: 'cash'
                });
                setShowForm(true);
            } else {
                alert(`Sesini duydum ama tam ayrıştıramadım kankam 💔 \nDuyulan ses: "${command}" \nLütfen önce kategoriyi, sonra fiyatı söylemeyi dene. Örn: 'Market 100'`);
            }
        };

        recognition.onerror = (err) => {
            console.error("Ses hatası:", err);
            alert('Mikrofon erişiminde sorun oluştu kankam.');
        };
    };

    const updateWalletBalance = (walletId, amount, isIncome) => {
        setWallets(prev => prev.map(w => {
            if (w.id === walletId) {
                return { ...w, balance: isIncome ? w.balance + amount : w.balance - amount };
            }
            return w;
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const amountNum = parseFloat(formData.amount);
        try {
            if (editing) {
                const response = await fetch(`http://localhost:5000/api/Expenses/${currentExpense.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        amount: amountNum,
                        date: currentExpense.date
                    })
                });
                if (response.ok) {
                    setEditing(false);
                    setCurrentExpense(null);
                    fetchExpenses();
                }
            } else {
                const response = await fetch('http://localhost:5000/api/Expenses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        amount: amountNum,
                        date: new Date().toISOString()
                    })
                });
                if (response.ok) {
                    fetchExpenses();
                }
            }
            updateWalletBalance(formData.walletId, amountNum, formData.isIncome);
            setFormData({ amount: '', category: '', description: '', isIncome: false, walletId: 'cash' });
            setShowForm(false);
        } catch (error) {
            console.error('Hata:', error);
            if (editing) {
                setExpenses(prev => prev.map(exp =>
                    exp.id === currentExpense.id ? { ...exp, ...formData, amount: amountNum } : exp
                ));
            } else {
                const newExpense = {
                    id: Date.now(),
                    ...formData,
                    amount: amountNum,
                    date: new Date().toISOString()
                };
                setExpenses(prev => [newExpense, ...prev]);
            }
            updateWalletBalance(formData.walletId, amountNum, formData.isIncome);
            setFormData({ amount: '', category: '', description: '', isIncome: false, walletId: 'cash' });
            setShowForm(false);
            setEditing(false);
            setCurrentExpense(null);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditing(false);
        setCurrentExpense(null);
        setFormData({ amount: '', category: '', description: '', isIncome: false, walletId: 'cash' });
    };

    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/Expenses/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchExpenses();
            }
        } catch (error) {
            console.error('Silme hatası:', error);
            setExpenses(prev => prev.filter(expense => expense.id !== id));
        }
    };

    const exportToExcel = () => {
        if (filteredExpenses.length === 0) {
            alert("İndirilecek hiç kayıt bulunamadı kankam!");
            return;
        }
        const BOM = '\uFEFF';
        let csvContent = "Kategori;Tür;Açıklama;Tutar;Para Birimi;Tarih\n";

        filteredExpenses.forEach(expense => {
            const displayAmount = isUSD ? expense.amount / exchangeRate : expense.amount;
            const typeText = expense.isIncome ? "Gelir" : "Gider";
            const formattedDate = new Date(expense.date).toLocaleDateString('tr-TR');
            csvContent += `${expense.category};${typeText};${expense.description};${displayAmount.toFixed(2)};${currencySymbol};${formattedDate}\n`;
        });

        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Harcama_Raporu_${new Date().toLocaleDateString('tr-TR')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    // İstatistikler hesapla
    const totalIncome = expenses.filter(e => e.isIncome).reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = expenses.filter(e => !e.isIncome).reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    // Kategori istatistikleri
    const categoryStats = expenses.reduce((acc, expense) => {
        if (!expense.isIncome) {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        }
        return acc;
    }, {});

    const topCategories = Object.entries(categoryStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    const pieChartData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

    const trendData = expenses
        .filter(e => !e.isIncome)
        .reduce((acc, expense) => {
            const dateLabel = new Date(expense.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
            const existing = acc.find(item => item.date === dateLabel);
            if (existing) { existing.tutar += expense.amount; } 
            else { acc.push({ date: dateLabel, tutar: expense.amount }); }
            return acc;
        }, [])
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);

    const COLORS = ['#FF9EB7', '#B5E2D8', '#FF7A9B', '#8DCFC1', '#FFD6E0', '#FFA502', '#FF6B6B'];
    const categories = [...new Set(expenses.map(e => e.category))];

    const categoryEmojis = {
        'Market': '🛒', 'Maaş': '💰', 'Ulaşım': '🚗', 'Eğlence': '🎬', 'Kahve': '☕',
        'Yemek': '🍽️', 'Alışveriş': '🛍️', 'Sağlık': '🏥', 'Eğitim': '📚', 'Kira': '🏠',
        'Fatura': '🧾', 'Spor': '⚽', 'Teknoloji': '💻', 'Giyim': '👕'
    };

    // Akıllı Döviz Dönüşümleri
    const displayIncome = isUSD ? totalIncome / exchangeRate : totalIncome;
    const displayExpense = isUSD ? totalExpense / exchangeRate : totalExpense;
    const displayBalance = isUSD ? balance / exchangeRate : balance;
    const currencySymbol = isUSD ? '$' : '₺';

    // Dinamik Bildirim Sistemi Hesaplaması
    const notifications = (() => {
        const list = [];
        if (totalExpense > 15000) {
            list.push({ id: 1, icon: '⚠️', text: 'Aylık gider limitinin %80\'ine ulaştın kankam, dikkat!', type: 'warning' });
        } else {
            list.push({ id: 1, icon: '✅', text: 'Mali durumun stabil, bütçe limitlerin güvende.', type: 'success' });
        }
        const currentBal = balance > 0 ? balance : 0;
        const progressPercent = (currentBal / savingsGoal.targetAmount) * 100;
        if (progressPercent >= 50) {
            list.push({ id: 2, icon: '🐖', text: `Harika! Kumbaranda %${progressPercent.toFixed(0)} başarıyı geçtin!`, type: 'success' });
        } else {
            list.push({ id: 2, icon: '💡', text: 'Kumbaradaki bilgisayar hedefine ulaşmak için birikime devam.', type: 'info' });
        }
        list.push({ id: 3, icon: '📅', text: 'Aboneliklerinin yenilenmesine son 3 gün kaldı.', type: 'info' });
        return list;
    })();

    const getAIVisualAdvice = () => {
        if (expenses.length === 0) {
            return { emoji: '✨', message: 'Henüz hiç harcama girmemişsin kankam! İlk harcamayı ekle, finansal durumunu hemen analiz edeyim.' };
        }
        if (topCategories.length > 0) {
            const [topCat, topAmount] = topCategories[0];
            const limit = budgetLimits[topCat] || 2000;
            if (topAmount >= limit) {
                return { emoji: '🚨', message: `Sümeyra, ${topCat} harcamaların resmen bütçe sınırını patlatmış (${topAmount.toFixed(0)} ₺)! Acil durum alarmı, bu kategoride frene basmamız lazım 💔` };
            }
        }
        if (balance < 0) {
            return { emoji: '📉', message: 'Eyvah! Net bakiyen şu an ekside görünüyor. Bu ay pembe gözlükleri birazcık çıkarıp tasarruf moduna mı geçsek acaba? 😭' };
        }
        if (totalExpense > totalIncome * 0.7 && totalIncome > 0) {
            return { emoji: '⚠️', message: 'Gelirinin %70\'inden fazlasını harcamışsın! Sınırda yürüyorsun, harcamaları biraz kategorize edip bütçeyi koruyalım.' };
        }
        return { emoji: '💎', message: 'Finansal durumun pırıl pırıl parlıyor, harika gidiyorsun! Beril ile birlikte kendinize güzel bir kahve ısmarlayabilirsiniz ✨' };
    };

    const aiAdvice = getAIVisualAdvice();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="App">
            {/* Header */}
            <div className="header-section">
                <h1>💖 Harcama Takipçim</h1>
                <p className="subtitle">Finanslarını pembe gözlükle takip et ✨</p>
            </div>

            {/* Sağ Üst Buton Grubu */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowNotifications(!showNotifications)} className="toggle-btn" style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
                        🔔 {notifications.length > 0 && (
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#FF6B6B', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: '700' }}>
                                {notifications.length}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="stat-card" style={{ position: 'absolute', top: '55px', right: '0', width: '300px', zIndex: 100, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-dark)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', fontWeight: '700' }}>Bildirimler 🔔</h4>
                            {notifications.map(noti => (
                                <div key={noti.id} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.82rem', background: 'rgba(255,255,255,0.3)', padding: '0.5rem', borderRadius: '8px', borderLeft: `4px solid ${noti.type === 'warning' ? '#FF6B6B' : noti.type === 'success' ? '#4E9F3D' : '#845EC2'}` }}>
                                    <span>{noti.icon}</span><span style={{ color: 'var(--text)', fontWeight: '500' }}>{noti.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={() => setIsUSD(!isUSD)} className="toggle-btn" style={{ fontSize: '1.2rem', cursor: 'pointer' }} title={isUSD ? "TL'ye Çevir" : "Dolar'a Çevir"}>
                    {isUSD ? '₺' : '$'}
                </button>
                <button className="toggle-btn" onClick={toggleTheme} style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Stats Toggle */}
            <div className="stats-toggle">
                <button className={`toggle-stats-btn ${showStats ? 'active' : ''}`} onClick={() => setShowStats(!showStats)}>
                    <i>{showStats ? '📊' : '📈'}</i>
                    {showStats ? 'İstatistikleri Gizle' : 'İstatistikleri Göster'}
                </button>
            </div>

            {/* İstatistik Kartları */}
            {showStats && (
                <div className="stats-container">
                    
                    {/* === MULTI-WALLET SANAL KART ROW (GÖRÜNÜRLÜK SORUNU GİDERİLDİ!) === */}
                    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                        {wallets.map(wallet => {
                            const displayWalletBalance = isUSD ? wallet.balance / exchangeRate : wallet.balance;
                            return (
                                <div key={wallet.id} style={{ 
                                    background: wallet.color, 
                                    color: 'white', 
                                    padding: '1.5rem', 
                                    borderRadius: '16px', 
                                    position: 'relative', 
                                    overflow: 'hidden', 
                                    minHeight: '130px', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'space-between', 
                                    boxShadow: '0 6px 18px rgba(0,0,0,0.25)', 
                                    border: '1px solid rgba(255,255,255,0.2)' 
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                                        <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{wallet.name}</span>
                                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.3)', padding: '3px 9px', borderRadius: '20px', fontWeight: '600' }}>Aktif</span>
                                    </div>
                                    <div style={{ zIndex: 2 }}>
                                        <small style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', display: 'block', marginBottom: '0.1rem', fontWeight: '500' }}>Kullanılabilir Bakiye</small>
                                        <span style={{ fontSize: '1.8rem', fontWeight: '800', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>{displayWalletBalance.toFixed(2)} {currencySymbol}</span>
                                    </div>
                                    <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', fontSize: '5rem', opacity: 0.18, zIndex: 1 }}>
                                        {wallet.id === 'cash' ? '💵' : wallet.id === 'bank' ? '🏦' : '💳'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Akıllı Pembe Asistan (AI) Paneli */}
                    <div className="stat-card ai-assistant-card" style={{ 
                        gridColumn: '1 / -1', background: 'linear-gradient(135deg, #FFF0F5, #FFE4E1)', 
                        borderLeft: '5px solid var(--primary-dark)', padding: '1.5rem', borderRadius: '16px', 
                        display: 'flex', alignItems: 'center', gap: '1.5rem'
                    }}>
                        <div style={{ fontSize: '3rem' }}>{aiAdvice.emoji}</div>
                        <div>
                            <h4 style={{ color: 'var(--primary-dark)', fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.3rem' }}>🤖 Akıllı Pembe Asistan (AI)</h4>
                            <p style={{ color: 'var(--text)', margin: 0, fontSize: '1rem', fontWeight: '500' }}>{aiAdvice.message}</p>
                        </div>
                    </div>

                    {/* Akıllı Kumbara Paneli */}
                    <div className="stat-card savings-kumbara-card" style={{ 
                        gridColumn: '1 / -1', background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', 
                        borderLeft: '5px solid #4E9F3D', padding: '1.5rem', borderRadius: '16px', 
                        display: 'flex', flexDirection: 'column', gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '2.5rem' }}>🐖</div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 style={{ color: '#1B5E20', fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.2rem' }}>Akıllı Kumbara & Hedef Takibi</h4>
                                <p style={{ color: '#2E7D32', margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>Hedef: {savingsGoal.name}</p>
                            </div>
                            <div>
                                <span style={{ fontWeight: '700', color: '#1B5E20', fontSize: '1.1rem' }}>
                                    {displayBalance >= 0 ? displayBalance.toFixed(0) : 0} / {(isUSD ? savingsGoal.targetAmount / exchangeRate : savingsGoal.targetAmount).toFixed(0)} {currencySymbol}
                                </span>
                            </div>
                        </div>
                        {(() => {
                            const currentBalance = balance > 0 ? balance : 0;
                            const progressPercent = Math.min((currentBalance / savingsGoal.targetAmount) * 100, 100);
                            return (
                                <div style={{ width: '100%' }}>
                                    <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #4E9F3D, #81C784)' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.85rem', color: '#2E7D32', fontWeight: '600' }}>
                                        <span>Başarı Oranı: %{progressPercent.toFixed(1)}</span>
                                        <span>{progressPercent >= 100 ? "🎉 Hedefe Ulaşıldı!" : `Kalan: ${(isUSD ? (savingsGoal.targetAmount - currentBalance) / exchangeRate : (savingsGoal.targetAmount - currentBalance)).toFixed(0)} ${currencySymbol}`}</span>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="stat-card income-card">
                        <div className="stat-header"><span className="stat-icon">📈</span><h3>Toplam Gelir</h3></div>
                        <p className="stat-amount income">+{displayIncome.toFixed(2)} {currencySymbol}</p>
                    </div>

                    <div className="stat-card expense-card">
                        <div className="stat-header"><span className="stat-icon">📉</span><h3>Toplam Gider</h3></div>
                        <p className="stat-amount expense">-{displayExpense.toFixed(2)} {currencySymbol}</p>
                    </div>

                    <div className={`stat-card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
                        <div className="stat-header"><span className="stat-icon">💎</span><h3>Net Bakiye</h3></div>
                        <p className="stat-amount">{displayBalance >= 0 ? '+' : ''}{displayBalance.toFixed(2)} {currencySymbol}</p>
                    </div>

                    {topCategories.length > 0 && (
                        <div className="top-categories-card">
                            <h3>🔥 En Çok Harcanan Kategoriler</h3>
                            <div className="top-categories-list">
                                {topCategories.map(([category, amount]) => (
                                    <div key={category} className="top-category-item">
                                        <span className="category-emoji">{categoryEmojis[category] || '📦'}</span>
                                        <div className="category-details">
                                            <div className="category-name">{category}</div>
                                            <div className="category-amount">{(isUSD ? amount / exchangeRate : amount).toFixed(2)} {currencySymbol}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="stat-card budget-tracker-card">
                        <h3>⚠️ Kategori Bütçe Durumları</h3>
                        <div className="budget-list" style={{ marginTop: '1rem' }}>
                            {Object.entries(categoryStats).map(([category, amount]) => {
                                const limit = budgetLimits[category] || 2000;
                                const percent = (amount / limit) * 100;
                                let progressColor = 'var(--income)';
                                if (percent >= 100) progressColor = 'var(--expense)';
                                else if (percent >= 80) progressColor = '#FFA502';

                                return (
                                    <div key={category} className="budget-item" style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                            <span>{categoryEmojis[category] || '📦'} <strong>{category}</strong></span>
                                            <span style={{ color: percent >= 100 ? 'var(--expense)' : 'var(--text-light)' }}>
                                                {(isUSD ? amount / exchangeRate : amount).toFixed(0)} / {(isUSD ? limit / exchangeRate : limit).toFixed(0)} {currencySymbol} ({percent.toFixed(0)}%)
                                            </span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.min(percent, 100)}%`, height: '100%', backgroundColor: progressColor }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Grafik Paneli */}
            {showStats && expenses.length > 0 && (
                <div className="charts-section-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    <div className="stat-card chart-card">
                        <h3 style={{ marginBottom: '1.5rem' }}>📈 Günlük Harcama Trendi</h3>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorTutar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary-dark)" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="var(--primary-dark)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="date" stroke="var(--text-light)" />
                                    <YAxis stroke="var(--text-light)" />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)', borderRadius: '8px' }} />
                                    <Legend />
                                    <Area type="monotone" dataKey="tutar" name="Harcama" stroke="var(--primary-dark)" strokeWidth={3} fillOpacity={1} fill="url(#colorTutar)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="stat-card chart-card">
                        <h3 style={{ marginBottom: '1.5rem' }}>🍰 Kategorilerin Dağılımı</h3>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                        {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Sabit Giderler ve Abonelik Paneli */}
            {showStats && (
                <div className="stat-card subscriptions-section" style={{ marginBottom: '3rem', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>⏰ Düzenli Abonelikler & Sabit Giderler</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        {subscriptions.map(sub => {
                            const daysLeft = getDaysUntilDue(sub.dueDate);
                            const displayPrice = isUSD ? sub.price / exchangeRate : sub.price;
                            const badgeBg = daysLeft <= 3 ? '#FF6B6B' : 'var(--primary-dark)';

                            return (
                                <div key={sub.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '1.2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.8rem' }}>{sub.emoji}</span>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{sub.name}</h4>
                                            <small style={{ color: 'var(--text-light)' }}>Her ayın {sub.dueDate}. günü</small>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '700', color: 'var(--text)', fontSize: '1.1rem' }}>{displayPrice.toFixed(2)} {currencySymbol}</span>
                                        <span style={{ background: badgeBg, color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                                            {daysLeft === 0 ? '📢 Bugün!' : `⏳ ${daysLeft} gün kaldı`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Kontrol Paneli */}
            <div className="controls-section">
                <div className="controls-grid">
                    <button className={`control-btn add-btn ${showForm ? 'cancel' : ''}`} onClick={() => setShowForm(!showForm)}>
                        {showForm ? '❌ İptal Et' : '➕ Yeni Kayıt'}
                    </button>
                    <button type="button" className="control-btn" style={{ background: 'var(--secondary-dark)', color: 'var(--text-on-primary)' }} onClick={() => window.print()}>
                        🖨️ PDF Raporu Al
                    </button>
                    <button type="button" className="control-btn" style={{ background: '#4E9F3D', color: 'white' }} onClick={exportToExcel}>
                        📊 Excel (CSV) İndir
                    </button>
                    <button type="button" className="control-btn" style={{ background: '#FF6B6B', color: 'white' }} onClick={handleVoiceCommand}>
                        🎙️ Sesli Ekle
                    </button>
                    <div className="search-container">
                        <input type="text" placeholder="🔍 Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    </div>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="control-select">
                        <option value="newest">📅 En Yeni</option>
                        <option value="oldest">📅 En Eski</option>
                        <option value="amount-high">💰 Yüksek Tutar</option>
                        <option value="amount-low">💰 Düşük Tutar</option>
                    </select>
                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="control-select">
                        <option value="all">Tüm Zamanlar</option>
                        <option value="today">🗓️ Bugün</option>
                        <option value="week">🗓️ Son 7 Gün</option>
                        <option value="month">🗓️ Son 30 Gün</option>
                    </select>
                </div>
            </div>

            {/* Kategori Filtreleri */}
            <div className="filter-container">
                <button className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>
                    🔄 Tümü ({expenses.length})
                </button>
                {categories.map(category => (
                    <button key={category} className={`filter-btn ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>
                        {categoryEmojis[category] || '📦'} {category} ({expenses.filter(e => e.category === category).length})
                    </button>
                ))}
            </div>

            {/* Form */}
            {showForm && (
                <div className="expense-form-container">
                    <form className="expense-form" onSubmit={handleSubmit}>
                        <h3 className="form-title">{editing ? '✏️ Kaydı Düzenle' : '✨ Yeni Kayıt Ekle'}</h3>
                        <div className="form-row">
                            <input type="number" name="amount" placeholder="💰 Tutar (₺)" value={formData.amount} onChange={handleInputChange} required step="0.01" className="form-input" />
                            <input type="text" name="category" placeholder="📂 Kategori" value={formData.category} onChange={handleInputChange} required className="form-input" />
                        </div>
                        
                        {/* Ödeme Yöntemi / Cüzdan Seçim Alanı */}
                        <div className="form-row" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <select 
                                name="walletId"
                                value={formData.walletId}
                                onChange={handleInputChange}
                                className="control-select"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.8)' }}
                            >
                                <option value="cash">💵 Nakit Cüzdan</option>
                                <option value="bank">🏦 Banka Hesabı (Ziraat)</option>
                                <option value="credit">💳 Kredi Kartı (Bonus)</option>
                            </select>
                        </div>

                        <input type="text" name="description" placeholder="📝 Açıklama" value={formData.description} onChange={handleInputChange} required className="form-input full-width" />
                        <div className="form-footer">
                            <button type="button" className="cancel-button" onClick={handleCancel}>İptal</button>
                            <label className="checkbox-label">
                                <input type="checkbox" name="isIncome" checked={formData.isIncome} onChange={handleInputChange} className="form-checkbox" />
                                <span className="checkmark"></span>💸 Bu bir gelir
                            </label>
                            <button type="submit" className="submit-button">{editing ? '💾 Güncelle' : '🚀 Kaydet'}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Kayıt Listesi */}
            <div className="results-info"><p>📊 {filteredExpenses.length} kayıt görüntüleniyor</p></div>
            <div className="expenses-list">
                {filteredExpenses.length === 0 ? (
                    <div className="no-results"><div className="no-results-icon">🔍</div><p>Kayıt bulunamadı</p></div>
                ) : (
                    filteredExpenses.map(expense => (
                        <div key={expense.id} className={`expense-card ${expense.isIncome ? 'income-type' : 'expense-type'}`}>
                            <div className="card-header">
                                <div className="card-title-section">
                                    <span className="category-emoji">{categoryEmojis[expense.category] || '📦'}</span>
                                    <div className="card-title-content">
                                        <h3 className="card-category">{expense.category}</h3>
                                        <span className="card-type">
                                            {expense.isIncome ? '💰 Gelir' : '💸 Gider'} • {expense.walletId === 'bank' ? '🏦 Banka' : expense.walletId === 'credit' ? '💳 Kart' : '💵 Nakit'}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button className="edit-button" onClick={() => handleEdit(expense)}>✏️</button>
                                    <button className="delete-button" onClick={() => deleteExpense(expense.id)}>❌</button>
                                </div>
                            </div>
                            <p className="card-description">📝 {expense.description}</p>
                            <div className="card-footer">
                                <p className={`card-amount ${expense.isIncome ? 'income' : 'expense'}`}>
                                    {expense.isIncome ? '+' : '-'}{(isUSD ? expense.amount / exchangeRate : expense.amount).toFixed(2)} {currencySymbol}
                                </p>
                                <small className="card-date">
                                    📅 {new Date(expense.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </small>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="footer"><p>💖 Pembe tonlarında tasarlanmıştır • React ile geliştirilmiştir ✨</p></div>
        </div>
    );
}

export default App;