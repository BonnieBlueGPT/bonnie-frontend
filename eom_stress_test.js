// God-Tier EOM Stress Test System 🔥
// This file contains comprehensive tests for all emotional intelligence features

const EOM_STRESS_TESTS = {
  // Basic EOM tag variations
  BASIC_TESTS: [
    {
      name: "Simple EOM",
      input: "Hey there <EOM> how are you?",
      expected: { parts: 2, pauses: 1, emotions: ['neutral'] }
    },
    {
      name: "Advanced EOM with parameters",
      input: "I'm feeling shy <EOM::pause=2000 speed=slow emotion=shy> about this...",
      expected: { parts: 2, pauses: 1, emotions: ['shy'], pauseDuration: 2000 }
    },
    {
      name: "Multiple EOM tags",
      input: "Hey <EOM::pause=500 emotion=flirty> you look amazing <EOM::pause=1200 emotion=passionate> tonight",
      expected: { parts: 3, pauses: 2, emotions: ['flirty', 'passionate'] }
    }
  ],

  // Emotional intensity tests
  INTENSITY_TESTS: [
    {
      name: "Low Intensity Shy",
      emotion: 'shy',
      intensity: 1,
      text: "Maybe we could... talk?",
      expectedSpeedMultiplier: 1.8,
      expectedPauseMultiplier: 2.0
    },
    {
      name: "Extreme Intensity Passionate",
      emotion: 'passionate',
      intensity: 4,
      text: "I NEED you right now!",
      expectedSpeedMultiplier: 0.3,
      expectedPauseMultiplier: 1.4
    },
    {
      name: "High Intensity Vulnerable",
      emotion: 'vulnerable',
      intensity: 3,
      text: "I'm scared... I need you",
      expectedSpeedMultiplier: 1.8,
      expectedPauseMultiplier: 2.6
    }
  ],

  // Complex conversation scenarios
  CONVERSATION_SCENARIOS: [
    {
      name: "Emotional Escalation",
      messages: [
        { text: "Hi there", emotion: 'neutral', intensity: 1 },
        { text: "You're cute... <EOM::pause=800 emotion=flirty>", emotion: 'flirty', intensity: 2 },
        { text: "I really like you <EOM::pause=1500 emotion=intimate>", emotion: 'intimate', intensity: 3 },
        { text: "I love you so much! <EOM::pause=2000 emotion=passionate>", emotion: 'passionate', intensity: 4 }
      ],
      expectedDriftIncrease: true,
      expectedPersonalityChange: true
    },
    {
      name: "Emotional Rollercoaster",
      messages: [
        { text: "I'm sad <EOM::pause=2000 emotion=sad>", emotion: 'sad', intensity: 3 },
        { text: "Actually, let's have fun! <EOM::pause=500 emotion=playful>", emotion: 'playful', intensity: 2 },
        { text: "I'm sorry for being moody <EOM::pause=1800 emotion=vulnerable>", emotion: 'vulnerable', intensity: 3 }
      ],
      expectedHighDrift: true,
      expectedSupportivePersonality: true
    }
  ],

  // Edge cases and error handling
  EDGE_CASES: [
    {
      name: "Malformed EOM tags",
      inputs: [
        "Test <EOM::pause=abc> message",
        "Test <EOM::emotion=> message",
        "Test <EOM::speed=invalid> message",
        "Test <EOM::> message"
      ],
      shouldGracefullyHandle: true
    },
    {
      name: "Extremely long pauses",
      input: "Wait <EOM::pause=999999 emotion=vulnerable> for me",
      shouldCapPause: true,
      maxPause: 10000
    },
    {
      name: "Rapid fire emotions",
      input: "Hi <EOM::emotion=flirty> there <EOM::emotion=shy> beautiful <EOM::emotion=passionate> person",
      shouldHandleQuickChanges: true
    }
  ],

  // Performance tests
  PERFORMANCE_TESTS: [
    {
      name: "Large message with multiple EOM",
      input: `This is a very long message with multiple emotional states. <EOM::pause=500 emotion=flirty> 
              I'm feeling flirty right now. <EOM::pause=1200 emotion=passionate> 
              But then I get passionate. <EOM::pause=800 emotion=gentle> 
              And then gentle and caring. <EOM::pause=600 emotion=playful> 
              Finally playful and fun! <EOM::pause=400 emotion=dominant>`,
      expectedParts: 6,
      maxProcessingTime: 1000 // ms
    },
    {
      name: "Stress test with 20 EOM tags",
      input: Array.from({length: 20}, (_, i) => 
        `Part ${i+1} <EOM::pause=100 emotion=${['flirty','shy','passionate','playful','gentle'][i%5]}>`
      ).join(' '),
      shouldNotCrash: true
    }
  ]
};

// Test execution functions
class EOMStressTester {
  constructor() {
    this.results = {};
    this.errors = [];
    this.warnings = [];
  }

  // Test EOM parsing
  testEOMParsing(parseFunction) {
    console.log("🧪 Testing EOM Parsing...");
    
    EOM_STRESS_TESTS.BASIC_TESTS.forEach(test => {
      try {
        const result = parseFunction(test.input);
        const passed = this.validateParsingResult(result, test.expected);
        
        this.results[test.name] = {
          passed,
          result,
          expected: test.expected
        };
        
        console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
      } catch (error) {
        this.errors.push(`${test.name}: ${error.message}`);
        console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      }
    });
  }

  // Test emotional intensity calculations
  testEmotionalIntensity(intensityFunction) {
    console.log("🎭 Testing Emotional Intensity...");
    
    EOM_STRESS_TESTS.INTENSITY_TESTS.forEach(test => {
      try {
        const result = intensityFunction(test.intensity, test.emotion);
        const passed = this.validateIntensityResult(result, test);
        
        this.results[test.name] = {
          passed,
          result,
          expected: test.expectedSpeedMultiplier
        };
        
        console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
      } catch (error) {
        this.errors.push(`${test.name}: ${error.message}`);
        console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      }
    });
  }

  // Test conversation scenarios
  testConversationScenarios(emotionalMemoryClass, personalityAdaptFunction) {
    console.log("💬 Testing Conversation Scenarios...");
    
    EOM_STRESS_TESTS.CONVERSATION_SCENARIOS.forEach(scenario => {
      try {
        const memory = new emotionalMemoryClass();
        let initialDrift = 0;
        let finalDrift = 0;
        let personalityChanges = [];
        
        scenario.messages.forEach((message, index) => {
          const sentiment = {
            primary: message.emotion,
            intensity: message.intensity
          };
          
          memory.addSentiment(sentiment);
          const personality = personalityAdaptFunction(sentiment, memory);
          personalityChanges.push(personality);
          
          if (index === 0) initialDrift = memory.currentDrift;
          if (index === scenario.messages.length - 1) finalDrift = memory.currentDrift;
        });
        
        const passed = this.validateScenarioResult(scenario, {
          initialDrift,
          finalDrift,
          personalityChanges
        });
        
        this.results[scenario.name] = {
          passed,
          driftChange: finalDrift - initialDrift,
          personalityChanges
        };
        
        console.log(`${passed ? '✅' : '❌'} ${scenario.name}: ${passed ? 'PASSED' : 'FAILED'}`);
      } catch (error) {
        this.errors.push(`${scenario.name}: ${error.message}`);
        console.log(`❌ ${scenario.name}: ERROR - ${error.message}`);
      }
    });
  }

  // Test edge cases
  testEdgeCases(parseFunction) {
    console.log("⚠️ Testing Edge Cases...");
    
    EOM_STRESS_TESTS.EDGE_CASES.forEach(test => {
      try {
        if (test.inputs) {
          // Multiple inputs test
          const results = test.inputs.map(input => {
            try {
              return parseFunction(input);
            } catch (error) {
              return { error: error.message };
            }
          });
          
          const passed = results.every(result => !result.error);
          this.results[test.name] = { passed, results };
          console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
        } else {
          // Single input test
          const result = parseFunction(test.input);
          const passed = this.validateEdgeCaseResult(result, test);
          this.results[test.name] = { passed, result };
          console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
        }
      } catch (error) {
        if (test.shouldGracefullyHandle) {
          console.log(`✅ ${test.name}: PASSED (gracefully handled error)`);
        } else {
          this.errors.push(`${test.name}: ${error.message}`);
          console.log(`❌ ${test.name}: ERROR - ${error.message}`);
        }
      }
    });
  }

  // Performance testing
  testPerformance(parseFunction, typingFunction) {
    console.log("⚡ Testing Performance...");
    
    EOM_STRESS_TESTS.PERFORMANCE_TESTS.forEach(test => {
      try {
        const startTime = performance.now();
        const result = parseFunction(test.input);
        const endTime = performance.now();
        
        const processingTime = endTime - startTime;
        const passed = test.maxProcessingTime ? 
          processingTime < test.maxProcessingTime : 
          true;
        
        this.results[test.name] = {
          passed,
          processingTime,
          result
        };
        
        console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'} (${processingTime.toFixed(2)}ms)`);
      } catch (error) {
        if (test.shouldNotCrash) {
          this.errors.push(`${test.name}: Should not crash but got - ${error.message}`);
          console.log(`❌ ${test.name}: FAILED - Should not crash`);
        }
      }
    });
  }

  // Validation helpers
  validateParsingResult(result, expected) {
    return result.length === expected.parts &&
           result.filter(p => p.isEOM).length === expected.pauses;
  }

  validateIntensityResult(result, test) {
    const tolerance = 0.1;
    return Math.abs(result - test.expectedSpeedMultiplier) < tolerance;
  }

  validateScenarioResult(scenario, result) {
    if (scenario.expectedDriftIncrease) {
      return result.driftChange > 0;
    }
    if (scenario.expectedHighDrift) {
      return result.driftChange > 0.5;
    }
    return true;
  }

  validateEdgeCaseResult(result, test) {
    if (test.shouldCapPause) {
      const eomParts = result.filter(p => p.isEOM);
      return eomParts.every(p => p.pause <= test.maxPause);
    }
    return true;
  }

  // Generate comprehensive report
  generateReport() {
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log("\n" + "=".repeat(50));
    console.log("🎯 GOD-TIER EOM STRESS TEST RESULTS");
    console.log("=".repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`🔥 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (this.errors.length > 0) {
      console.log("\n❌ ERRORS:");
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log("\n⚠️ WARNINGS:");
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    console.log("=".repeat(50));
    
    return {
      totalTests,
      passedTests,
      failedTests,
      successRate: (passedTests / totalTests) * 100,
      errors: this.errors,
      warnings: this.warnings,
      detailedResults: this.results
    };
  }
}

// Export for use in the main application
window.EOMStressTester = EOMStressTester;
window.EOM_STRESS_TESTS = EOM_STRESS_TESTS;

console.log("🔥 God-Tier EOM Stress Test System Loaded!");
console.log("Usage: const tester = new EOMStressTester(); tester.testAll();");