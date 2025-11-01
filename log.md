BUNDLE  ./index.ts



 LOG  Running "shared" with {"initialProps":{"initialColorPreference":"dark","loadingStartTs":1761976023790,"initialFontScale":"100"},"rootTag":81}

 ERROR  Error: Unexpected type given to ListRowTexts



This error is located at:

    in ListRowTexts (created by OnboardingScreen)

    in RCTView (created by View)

    in View

토스 강아지 프로젝트
사용자설정 Gem
This error, Error: Unexpected type given to ListRowTexts, indicates that the ListRow.Texts component from @toss/tds-react-native does not accept a prop named type with the value "1Row".

This prop was likely based on an incorrect assumption or an example from a different component.

🛠️ How to Fix
You need to remove the type="1Row" prop from all three instances of <ListRow.Texts> in your pages/onboarding/index.tsx file. The component will correctly render the text using just the top and topProps.

Modify this part of your code:

TypeScript
// ... (Value Cards) ...
<List.Group>
  <ListRow
    left={
      <Asset.Icon
        name="icon-brain-mono"
        frameShape={Asset.frameShape.CleanW24}
      />
    }
    contents={
      <ListRow.Texts
        // type="1Row"  <--- 1. 이 줄을 삭제하세요
        top="AI 맞춤 훈련 루틴"
        topProps={{ typography: 't6', fontWeight: 'semibold' }}
      />
    }
  />
  <ListRow
    left={
      <Asset.Icon
        name="icon-user-account-mono"
        frameShape={Asset.frameShape.CleanW24}
      />
    }
    contents={
      <ListRow.Texts
        // type="1Row"  <--- 2. 이 줄을 삭제하세요
        top="전문 훈련사 연결"
        topProps={{ typography: 't6', fontWeight: 'semibold' }}
      />
    }
  />
  <ListRow
    left={
      <Asset.Icon
        name="icon-creditcard-mono"
        frameShape={Asset.frameShape.CleanW24}
      />
    }
    contents={
      <ListRow.Texts
        // type="1Row"  <--- 3. 이 줄을 삭제하세요
        top="기록과 결제, 통합 관리"
        topProps={{ typography: 't6', fontWeight: 'semibold' }}
      />
    }
  />
</List.Group>
// ...
By removing the unsupported type prop, the error should be resolved.