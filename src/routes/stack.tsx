import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Gift, Zap, Star, CreditCard } from 'lucide-react';

const PLATFORM_BASE_WIDTH = 120;
const PLATFORM_BASE_SPEED = 5;
const PLATFORM_MIN_WIDTH = 45;
const PLATFORM_MAX_SPEED = 14;
const BLOCK_HEIGHT = 24;
const GAME_WIDTH = 320;
const GAME_HEIGHT = 500;

const SHOP_ITEMS = [
  { id: 'default', name: 'Classic', price: 0, pattern: 'solid', color: '#06b6d4', purchased: true },
  { id: 'neon', name: 'Neon', price: 50, pattern: 'solid', color: '#00ff88', purchased: false },
  { id: 'gradient', name: 'Aurora', price: 75, pattern: 'gradient', color: '#a855f7', purchased: false },
  { id: 'space', name: 'Deep Space', price: 100, pattern: 'dots', color: '#3b82f6', purchased: false },
  { id: 'lava', name: 'Lava', price: 80, pattern: 'solid', color: '#ff4500', purchased: false },
  { id: 'crystal', name: 'Crystal', price: 120, pattern: 'gradient', color: '#ec4899', purchased: false },
  { id: 'forest', name: 'Forest', price: 60, pattern: 'solid', color: '#10b981', purchased: false },
  { id: 'sunset', name: 'Sunset', price: 90, pattern: 'gradient', color: '#f97316', purchased: false },
];

const GEM_PACKAGES = [
  { gems: 150, price: 4.99, label: '150 Gems', package: 'starter', popular: false },
  { gems: 400, price: 9.99, label: '400 Gems', package: 'power', popular: true },
  { gems: 1200, price: 24.99, label: '1200 Gems', package: 'legendary', popular: false },
];

interface Block {
  id: number;
  x: number;
  width: number;
  landed: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: 'gem' | 'star';
}

export default function StackGame() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [score, setScore] = useState(0);
  const [gems, setGems] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [platformWidth, setPlatformWidth] = useState(PLATFORM_BASE_WIDTH);
  const [platformSpeed, setPlatformSpeed] = useState(PLATFORM_BASE_SPEED);
  const [platformPosition, setPlatformPosition] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedShopItem, setSelectedShopItem] = useState('default');
  const [shopItems, setShopItems] = useState(SHOP_ITEMS);
  const [showShop, setShowShop] = useState(false);
  const [showBuyGems, setShowBuyGems] = useState(false);
  const [platformReady, setPlatformReady] = useState(false);
  const [blocksPlaced, setBlocksPlaced] = useState(0);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [userId] = useState(`user_${Math.random().toString(36).slice(2, 9)}`);
  const [giftClaimed, setGiftClaimed] = useState(false);

  const gameLoopRef = useRef<number>();
  const blocksRef = useRef<Block[]>([]);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const gemRef = useRef(0);
  const streakRef = useRef(0);
  const particleIdRef = useRef(0);
  const currentBlockIdRef = useRef(0);
  const platformPositionRef = useRef(0);
  const platformDirectionRef = useRef(1);
  const platformSpeedRef = useRef(PLATFORM_BASE_SPEED);
  const platformWidthRef = useRef(PLATFORM_BASE_WIDTH);
  const platformReadyRef = useRef(false);
  const blocksPlacedRef = useRef(0);

  const currentShopItem = shopItems.find(item => item.id === selectedShopItem) || shopItems[0];

  const calculateDifficulty = (points: number) => {
    const baseWidth = 120;
    const minWidth = 45;
    const baseSpeed = 5;
    const maxSpeed = 14;
    const widthDecrement = Math.min(baseWidth - minWidth, points * 0.7);
    const width = baseWidth - widthDecrement;
    const speedIncrement = Math.min(maxSpeed - baseSpeed, points * 0.1);
    const speed = baseSpeed + speedIncrement;
    return { width: Math.max(minWidth, width), speed: Math.min(maxSpeed, speed) };
  };

  const createParticles = (x: number, y: number, type: 'gem' | 'star', count = 8) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const velocity = 2 + Math.random() * 3;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 1,
        life: 1,
        type,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const getBlockColor = () => {
    const item = shopItems.find(i => i.id === selectedShopItem);
    return item?.color || '#06b6d4';
  };

  const getBlockPattern = () => {
    const item = shopItems.find(i => i.id === selectedShopItem);
    return item?.pattern || 'solid';
  };

  const renderBlockStyle = (block: Block) => {
    const color = getBlockColor();
    const pattern = getBlockPattern();
    let background = color;
    if (pattern === 'gradient') {
      background = `linear-gradient(to right, ${color}, ${color}99)`;
    } else if (pattern === 'dots') {
      background = `repeating-linear-gradient(45deg, ${color}, ${color} 10px, ${color}80 10px, ${color}80 20px)`;
    }
    return { background, boxShadow: `0 0 12px ${color}99` };
  };

  const spawnBlock = () => {
    const platformY = GAME_HEIGHT - (blocksRef.current.length * BLOCK_HEIGHT) - BLOCK_HEIGHT;
    if (platformY < 0) {
      endGame();
      return;
    }
    const newWidth = platformWidthRef.current;
    const randomStart = Math.random() > 0.5 ? 0 : GAME_WIDTH - newWidth;
    platformPositionRef.current = randomStart;
    platformDirectionRef.current = randomStart < GAME_WIDTH / 2 ? 1 : -1;
    setPlatformReady(true);
  };

  const handleBlockPlace = () => {
    if (!gameStarted || gameOverRef.current || !platformReadyRef.current) return;

    const platformY = GAME_HEIGHT - (blocksRef.current.length * BLOCK_HEIGHT) - BLOCK_HEIGHT;
    const currentWidth = platformWidthRef.current;
    const blockX = platformPositionRef.current;
    setPlatformReady(false);

    let finalWidth = currentWidth;
    let finalX = blockX;
    let isPerfect = false;

    if (blocksRef.current.length > 0) {
      const blockBelow = blocksRef.current[blocksRef.current.length - 1];
      const overlapStart = Math.max(blockX, blockBelow.x);
      const overlapEnd = Math.min(blockX + currentWidth, blockBelow.x + blockBelow.width);
      const overlapWidth = Math.max(0, overlapEnd - overlapStart);

      if (overlapWidth === 0) {
        gameOverRef.current = true;
        setGameOver(true);
        setGameStarted(false);
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        return;
      }

      const leftAlignDiff = Math.abs(blockX - blockBelow.x);
      const rightAlignDiff = Math.abs((blockX + currentWidth) - (blockBelow.x + blockBelow.width));
      isPerfect = (leftAlignDiff <= 2 && rightAlignDiff <= 2) || (leftAlignDiff <= 2 || rightAlignDiff <= 2);

      if (isPerfect) {
        finalWidth = currentWidth;
        finalX = blockX;
      } else {
        finalWidth = overlapWidth;
        finalX = overlapStart;
      }
    } else {
      isPerfect = true;
    }

    const newBlock: Block = {
      id: currentBlockIdRef.current++,
      x: finalX,
      width: finalWidth,
      landed: true,
    };
    blocksRef.current.push(newBlock);
    setBlocks([...blocksRef.current]);

    if (isPerfect) {
      scoreRef.current += 1;
      streakRef.current += 1;
      blocksPlacedRef.current += 1;
      const newScore = scoreRef.current;
      const newStreak = streakRef.current;
      const newBlocksPlaced = blocksPlacedRef.current;
      setScore(newScore);
      setStreak(newStreak);
      setBlocksPlaced(newBlocksPlaced);
      createParticles(finalX + finalWidth / 2, platformY, 'star', 6);
      gemRef.current += 1;
      setGems(gemRef.current);
      createParticles(finalX + finalWidth / 2, platformY - 20, 'gem', 4);
      gemRef.current += 10;
      setGems(gemRef.current);
      createParticles(finalX + finalWidth / 2, platformY - 40, 'gem', 12);

      if (newScore % 10 === 0) {
        gemRef.current += 1;
        setGems(gemRef.current);
        createParticles(finalX + finalWidth / 2, platformY - 20, 'gem', 4);
      }

      if (newStreak > 0 && newStreak % 5 === 0) {
        const bonusWidth = platformWidthRef.current + 10;
        platformWidthRef.current = bonusWidth;
        setPlatformWidth(bonusWidth);
        createParticles(finalX + finalWidth / 2, platformY - 30, 'star', 12);
      }

      const difficulty = calculateDifficulty(newBlocksPlaced);
      platformWidthRef.current = difficulty.width;
      platformSpeedRef.current = difficulty.speed;
      setPlatformWidth(difficulty.width);
      setPlatformSpeed(difficulty.speed);
    } else {
      streakRef.current = 0;
      setStreak(0);
      createParticles(finalX + finalWidth / 2, platformY, 'star', 3);
      gemRef.current += 1;
      setGems(gemRef.current);
      createParticles(finalX + finalWidth / 2, platformY - 20, 'gem', 3);
      platformWidthRef.current = finalWidth;
      setPlatformWidth(finalWidth);
      const difficulty = calculateDifficulty(blocksPlacedRef.current + 1);
      platformSpeedRef.current = difficulty.speed;
      setPlatformSpeed(difficulty.speed);
    }

    setTimeout(() => {
      if (!gameOverRef.current) {
        spawnBlock();
      }
    }, 200);
  };

  const endGame = () => {
    gameOverRef.current = true;
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    setGameOver(true);
    setGameStarted(false);
  };

  const gameLoop = () => {
    if (platformReadyRef.current) {
      const maxX = GAME_WIDTH - platformWidthRef.current;
      platformPositionRef.current += platformDirectionRef.current * platformSpeedRef.current;
      if (platformPositionRef.current <= 0) {
        platformPositionRef.current = 0;
        platformDirectionRef.current = 1;
      } else if (platformPositionRef.current >= maxX) {
        platformPositionRef.current = maxX;
        platformDirectionRef.current = -1;
      }
      setPlatformPosition(platformPositionRef.current);
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const particleTimer = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15,
            life: p.life - 0.05,
          }))
          .filter(p => p.life > 0)
      );
    }, 16);
    return () => clearInterval(particleTimer);
  }, []);

  useEffect(() => {
    platformReadyRef.current = platformReady;
  }, [platformReady]);

  useEffect(() => {
    const savedGems = localStorage.getItem('stackTowerGems');
    if (savedGems) {
      const loadedGems = parseInt(savedGems, 10);
      setGems(loadedGems);
      gemRef.current = loadedGems;
    }

    const giftClaimedStatus = localStorage.getItem('stackTowerGiftClaimed');
    if (giftClaimedStatus === 'true') {
      setGiftClaimed(true);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('success')) {
      const gemsParam = params.get('gems');
      if (gemsParam) {
        const purchasedGems = parseInt(gemsParam, 10);
        setGems(prev => {
          const newTotal = prev + purchasedGems;
          gemRef.current = newTotal;
          localStorage.setItem('stackTowerGems', newTotal.toString());
          return newTotal;
        });
        setPurchaseSuccess(true);
        setTimeout(() => setPurchaseSuccess(false), 3000);
        window.history.replaceState({}, document.title, '/stack');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stackTowerGems', gems.toString());
  }, [gems]);

  const handleBuyGems = async (gemPackage: typeof GEM_PACKAGES[0]) => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gems', package: gemPackage.package, user_id: userId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout failed:', data.error);
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      setIsCheckingOut(false);
    }
  };

  const handleClaimGift = () => {
    if (giftClaimed) return;
    gemRef.current += 20;
    setGems(gemRef.current);
    setGiftClaimed(true);
    localStorage.setItem('stackTowerGiftClaimed', 'true');
    createParticles(40, 40, 'gem', 12);
  };

  const handleBuyItem = (itemId: string) => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.purchased) {
      setSelectedShopItem(itemId);
      return;
    }

    if (gemRef.current >= item.price) {
      gemRef.current -= item.price;
      setGems(gemRef.current);
      setShopItems(shopItems.map(i =>
        i.id === itemId ? { ...i, purchased: true } : i
      ));
      setSelectedShopItem(itemId);
    }
  };

  const handleStart = () => {
    if (!gameStarted && !gameOver) {
      setGameStarted(true);
      setGameOver(false);
      gameOverRef.current = false;
      setScore(0);
      setStreak(0);
      setBlocksPlaced(0);
      scoreRef.current = 0;
      gemRef.current = 0;
      streakRef.current = 0;
      blocksPlacedRef.current = 0;
      currentBlockIdRef.current = 0;
      const difficulty = calculateDifficulty(0);
      platformWidthRef.current = difficulty.width;
      platformSpeedRef.current = difficulty.speed;
      setPlatformWidth(difficulty.width);
      setPlatformSpeed(difficulty.speed);
      blocksRef.current = [];
      setBlocks([]);
      setParticles([]);
      spawnBlock();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleRestart = () => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setStreak(0);
    setBlocksPlaced(0);
    setPlatformWidth(PLATFORM_BASE_WIDTH);
    setPlatformSpeed(PLATFORM_BASE_SPEED);
    setPlatformPosition(0);
    setPlatformReady(false);
    blocksRef.current = [];
    setBlocks([]);
    setParticles([]);
    platformPositionRef.current = 0;
    platformDirectionRef.current = 1;
    platformSpeedRef.current = PLATFORM_BASE_SPEED;
    platformWidthRef.current = PLATFORM_BASE_WIDTH;
    blocksPlacedRef.current = 0;
  };

  const platformY = GAME_HEIGHT - (blocks.length * BLOCK_HEIGHT) - BLOCK_HEIGHT;

  return (
    <div className="min-h-screen bg-[#05050f] text-[#f0f0ff] font-sans overflow-hidden flex flex-col items-center justify-center p-3 sm:p-4 relative">
      <style>{`
        @keyframes gemPop { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }
        @keyframes starShine { 0% { transform: scale(1) rotate(0deg); opacity: 1; } 100% { transform: scale(0) rotate(360deg); opacity: 0; } }
        @keyframes slideIn { 0% { transform: translateX(-100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes easterEggFloat { 0% { transform: translate(0, 0) rotate(15deg) scale(1); } 25% { transform: translate(-30px, -40px) rotate(20deg) scale(1.1); } 50% { transform: translate(-60px, -80px) rotate(25deg) scale(1); } 75% { transform: translate(-40px, -50px) rotate(18deg) scale(1.08); } 100% { transform: translate(0, 0) rotate(15deg) scale(1); } }
        @keyframes spaceshipGlow { 0%, 100% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 40px rgba(212, 160, 23, 0.2)); } 50% { filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 60px rgba(212, 160, 23, 0.3)); } }
        .gem-particle { animation: gemPop 0.8s ease-out forwards; }
        .star-particle { animation: starShine 0.6s ease-out forwards; }
        .gem-badge { animation: slideIn 0.3s ease-out; }
        .pulse-animation { animation: pulse 2s ease-in-out infinite; }
        .easter-egg-spaceship { animation: easterEggFloat 8s ease-in-out infinite; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .easter-egg-spaceship:hover { animation: easterEggFloat 8s ease-in-out infinite, spaceshipGlow 2s ease-in-out infinite; filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 80px rgba(212, 160, 23, 0.5)); }
      `}</style>

      <button
        onClick={handleClaimGift}
        disabled={giftClaimed}
        className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-bold text-xs hover:shadow-lg hover:shadow-amber-500/50 transition min-h-[40px] sm:min-h-[44px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Gift size={16} /> {giftClaimed ? '✓ Claimed' : '+20 Gift'}
      </button>

      <button
        onClick={() => window.location.href = 'https://verticalsushi.zo.space/'}
        className="easter-egg-spaceship fixed bottom-4 right-4 z-30 sm:bottom-12 sm:right-12 cursor-pointer text-5xl sm:text-8xl block hover:scale-125 group"
        title="🚀 Navigate back to portfolio (Easter egg!)"
      >
        <span className="inline-block">🚀</span>
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-[#090d1c] border border-[#3b82f6] rounded px-2 py-1 whitespace-nowrap mono-font text-xs text-[#3b82f6] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Back to portfolio...
        </div>
      </button>

      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-xs sm:text-sm gem-badge min-h-[40px] sm:min-h-[44px] justify-center">
        <Star size={16} fill="currentColor" /> {gems}
      </div>

      {purchaseSuccess && (
        <div className="absolute top-20 right-4 z-20 px-4 py-3 bg-green-500 rounded-lg font-bold text-white animate-bounce">
          ✓ Gems added successfully!
        </div>
      )}

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-center">
          STACK TOWER
        </h1>
        <p className="text-center text-purple-300 mb-4 sm:mb-8 text-xs sm:text-sm">Place blocks perfectly. Earn gems. Customize your tower.</p>

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 items-center lg:items-start justify-center px-2 sm:px-4">
          <div
            className="relative bg-slate-900 border-2 rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: GAME_WIDTH + 'px',
              height: GAME_HEIGHT + 'px',
              borderColor: currentShopItem.color,
              boxShadow: `0 0 20px ${currentShopItem.color}40`,
              minWidth: '320px',
              maxWidth: '100%'
            }}
            onClick={handleBlockPlace}
          >
            <div className="absolute inset-0 opacity-10">
              {[...Array(Math.ceil(GAME_HEIGHT / 30))].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t"
                  style={{ top: (i * 30) + 'px', borderColor: currentShopItem.color }}
                />
              ))}
            </div>

            {blocks.map((block, idx) => {
              const blockY = GAME_HEIGHT - ((idx + 1) * BLOCK_HEIGHT);
              return (
                <div
                  key={block.id}
                  className="absolute rounded transition-all font-bold text-xs shadow-lg border"
                  style={{
                    left: block.x + 'px',
                    top: blockY + 'px',
                    width: block.width + 'px',
                    height: BLOCK_HEIGHT + 'px',
                    borderColor: currentShopItem.color,
                    ...renderBlockStyle(block),
                  }}
                />
              );
            })}

            {gameStarted && !gameOver && (
              <div
                className="absolute border-2 border-dashed rounded transition-none"
                style={{
                  left: platformPosition + 'px',
                  top: platformY + 'px',
                  width: platformWidth + 'px',
                  height: BLOCK_HEIGHT + 'px',
                  borderColor: currentShopItem.color,
                  background: `${currentShopItem.color}15`,
                }}
              />
            )}

            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur">
                <p className="text-4xl font-black mb-2" style={{ color: currentShopItem.color }}>GAME OVER</p>
                <p className="text-xl mb-1">Score: {score}</p>
                <p className="text-lg mb-6 text-yellow-300">Earned {streak > 0 ? streak : 0} blocks</p>
                <button onClick={handleRestart} className="px-6 py-3 rounded font-bold hover:shadow-lg transition" style={{ background: `linear-gradient(to right, ${currentShopItem.color}, ${currentShopItem.color}80)`, boxShadow: `0 0 20px ${currentShopItem.color}66` }}>
                  <RotateCcw className="inline mr-2" size={20} /> Try Again
                </button>
              </div>
            )}

            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur">
                <p className="text-3xl font-bold mb-2">Click to Start</p>
                <p className="text-sm text-purple-300">Place blocks perfectly to earn gems</p>
              </div>
            )}

            {particles.map(p => (
              <div
                key={p.id}
                className={p.type === 'gem' ? 'gem-particle' : 'star-particle'}
                style={{
                  position: 'absolute',
                  left: p.x + 'px',
                  top: p.y + 'px',
                  width: p.type === 'gem' ? '10px' : '6px',
                  height: p.type === 'gem' ? '10px' : '6px',
                  background: p.type === 'gem' ? '#fbbf24' : currentShopItem.color,
                  borderRadius: '50%',
                  opacity: p.life,
                  boxShadow: p.type === 'gem' ? '0 0 8px #fbbf24' : `0 0 6px ${currentShopItem.color}`,
                }}
              />
            ))}
          </div>

          <div className="bg-slate-900 border-2 border-purple-500 rounded-lg p-3 sm:p-5 w-full lg:max-w-xs">
            <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-purple-300">HUD</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="p-2 sm:p-3 bg-slate-800 rounded border border-cyan-500/30 min-h-[70px] flex flex-col justify-center">
                <p className="text-xs text-gray-400 mb-1">SCORE</p>
                <p className="text-2xl sm:text-3xl font-black" style={{ color: currentShopItem.color }}>{score}</p>
              </div>
              <div className="p-2 sm:p-3 bg-slate-800 rounded border border-purple-500/30 min-h-[70px] flex flex-col justify-center">
                <p className="text-xs text-gray-400 mb-1">STREAK</p>
                <p className="text-2xl sm:text-3xl font-black text-yellow-300">{streak}</p>
              </div>
            </div>

            {gameStarted && (
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
                <div className="p-2 sm:p-3 bg-slate-800 rounded border border-cyan-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400">Platform Width</p>
                    <p className="text-xs font-bold text-cyan-300">{platformWidth.toFixed(0)}px</p>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${((platformWidth - PLATFORM_MIN_WIDTH) / (PLATFORM_BASE_WIDTH - PLATFORM_MIN_WIDTH)) * 100}%`, background: `linear-gradient(to right, ${currentShopItem.color}, ${currentShopItem.color}80)` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{PLATFORM_MIN_WIDTH}px — {PLATFORM_BASE_WIDTH}px</p>
                </div>

                <div className="p-2 sm:p-3 bg-slate-800 rounded border border-purple-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400">Platform Speed</p>
                    <p className="text-xs font-bold text-purple-300">{platformSpeed.toFixed(1)}px/fr</p>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${((platformSpeed - PLATFORM_BASE_SPEED) / (PLATFORM_MAX_SPEED - PLATFORM_BASE_SPEED)) * 100}%`, background: `linear-gradient(to right, #a855f7, #a855f780)` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{PLATFORM_BASE_SPEED}px/fr — {PLATFORM_MAX_SPEED}px/fr</p>
                </div>

                <div className="p-2 sm:p-3 bg-slate-800 rounded border border-amber-500/30">
                  <p className="text-xs text-gray-400 mb-1">Blocks Placed (Difficulty)</p>
                  <p className="text-2xl sm:text-3xl font-black text-amber-300">{blocksPlaced}</p>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-4 sm:mb-5">
              <button onClick={handleStart} disabled={gameStarted} className="w-full py-2 sm:py-3 rounded font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] flex items-center justify-center" style={{ background: `linear-gradient(to right, ${currentShopItem.color}, ${currentShopItem.color}80)`, boxShadow: `0 0 15px ${currentShopItem.color}66` }}>
                {gameStarted ? 'Game Running' : 'Start Game'}
              </button>

              <button onClick={() => setShowBuyGems(!showBuyGems)} className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded font-bold hover:shadow-lg hover:shadow-green-500/50 transition flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]">
                <CreditCard size={16} /> Buy Gems
              </button>

              <button onClick={() => setShowShop(!showShop)} className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded font-bold hover:shadow-lg hover:shadow-amber-500/50 transition text-sm sm:text-base min-h-[44px] flex items-center justify-center">
                <Zap className="inline mr-2" size={16} /> Shop
              </button>

              <button onClick={handleRestart} disabled={!gameStarted && !gameOver} className="w-full py-2 sm:py-2.5 bg-slate-700 rounded font-bold hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] flex items-center justify-center">
                <RotateCcw className="inline mr-2" size={16} /> Reset
              </button>
            </div>

            <div className="bg-slate-800 rounded p-2 sm:p-3 border border-purple-500/30 text-xs text-gray-300 space-y-1 hidden sm:block">
              <p className="font-bold text-purple-300 mb-2">💡 Tips</p>
              <p>✦ Perfect placements earn gems (1 per 10 points)</p>
              <p>✦ Imperfect placements reduce next platform width</p>
              <p>✦ Click to freeze the platform</p>
              <p>✦ Tower gets harder as you climb</p>
              <p>✦ 5 perfect placements = wider base</p>
            </div>
          </div>
        </div>

        {showBuyGems && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-300">💳 BUY GEMS</h2>
                <button onClick={() => setShowBuyGems(false)} className="text-2xl font-bold text-gray-400 hover:text-white">✕</button>
              </div>

              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Purchase gems to unlock exclusive themes and boost your game.</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {GEM_PACKAGES.map(pkg => (
                  <button key={pkg.gems} onClick={() => handleBuyGems(pkg)} disabled={isCheckingOut} className="relative p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-lg disabled:opacity-50 min-h-[120px] flex flex-col justify-center items-center" style={{ borderColor: pkg.popular ? '#10b981' : '#4b5563', background: pkg.popular ? '#10b98120' : '#4b556330', boxShadow: pkg.popular ? '0 0 15px #10b98166' : 'none' }}>
                    {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">POPULAR</div>}
                    <div className="text-2xl sm:text-3xl font-black text-yellow-300 mb-1 sm:mb-2">{pkg.gems}</div>
                    <p className="font-bold text-xs sm:text-sm mb-1 sm:mb-3 text-center">{pkg.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-400">${pkg.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1 sm:mt-2">{(pkg.price / pkg.gems * 100).toFixed(2)}¢ per gem</p>
                  </button>
                ))}
              </div>

              <p className="text-center text-gray-400 text-xs mt-4 sm:mt-6">Secure payment by Stripe. You'll be redirected to complete your purchase.</p>
            </div>
          </div>
        )}

        {showShop && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-yellow-500 rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300">STYLE SHOP</h2>
                <button onClick={() => setShowShop(false)} className="text-2xl font-bold text-gray-400 hover:text-white">✕</button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {shopItems.map(item => (
                  <button key={item.id} onClick={() => handleBuyItem(item.id)} className="p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-lg" style={{ borderColor: selectedShopItem === item.id ? item.color : '#4b5563', background: selectedShopItem === item.id ? `${item.color}20` : '#4b556330', boxShadow: selectedShopItem === item.id ? `0 0 15px ${item.color}66` : 'none' }}>
                    <div className="w-full h-12 sm:h-16 rounded mb-2 sm:mb-3 border" style={{ background: item.pattern === 'gradient' ? `linear-gradient(to right, ${item.color}, ${item.color}80)` : item.pattern === 'dots' ? `repeating-linear-gradient(45deg, ${item.color}, ${item.color} 10px, ${item.color}80 10px, ${item.color}80 20px)` : item.color, borderColor: item.color }} />
                    <p className="font-bold text-xs sm:text-sm mb-1 sm:mb-2">{item.name}</p>
                    {item.purchased ? (selectedShopItem === item.id ? <p className="text-xs text-green-400 font-bold">EQUIPPED</p> : <p className="text-xs text-gray-400">Owned</p>) : <p className="text-xs font-bold" style={{ color: item.color }}>{item.price} gems</p>}
                  </button>
                ))}
              </div>

              <p className="text-center text-gray-400 text-xs mt-4 sm:mt-6">Current gems: {gems}</p>
            </div>
          </div>
        )}

        <p className="text-center text-gray-500 mt-6 sm:mt-10 text-xs">Tap or click blocks to place them • Collect gems in the shop</p>
      </div>
    </div>
  );
}