#!/bin/bash

echo "🚀 Starting Hardhat Node in background..."
npx hardhat node &

# Wait for node to be ready
sleep 5

echo "📦 Deploying contracts..."
npx hardhat run scripts/deploy.js --network localhost

echo "🎟️ Setting claim codes..."
npx hardhat run scripts/setClaimCodes.js --network localhost

echo "💰 Funding test accounts..."
npx hardhat run scripts/test_fund.js --network localhost

echo "✅ All setup scripts completed. Container running."

# Keep the container alive
tail -f /dev/null
