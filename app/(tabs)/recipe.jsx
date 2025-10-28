import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { generateAIRecipe } from '../../api';

const mealTypes = [
  { label: 'Breakfast', value: 'Breakfast' },
  { label: 'Lunch', value: 'Lunch' },
  { label: 'Dinner', value: 'Dinner' },
  { label: 'Snack', value: 'Snack' },
];

const cookingTimes = [
  { label: 'Under 30 minutes', value: 'Under 30 minutes' },
  { label: '30-60 minutes', value: '30-60 minutes' },
  { label: 'Over 1 hour', value: 'Over 1 hour' },
];

const complexityOptions = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Hard', value: 'Hard' },
];

export default function RecipesScreen() {
  const [ingredients, setIngredients] = useState('');
  const [mealType, setMealType] = useState(null);
  const [cuisine, setCuisine] = useState('');
  const [cookingTime, setCookingTime] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [recipeText, setRecipeText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      setRecipeText('Please enter some ingredients.');
      return;
    }

    const input = {
      ingredients: ingredients.split(',').map(i => i.trim()),
      mealType,
      cuisine,
      cookingTime,
      complexity,
    };

    try {
      setLoading(true);
      const result = await generateAIRecipe(input);
      setRecipeText(result);
    } catch (error) {
      setRecipeText('Failed to generate recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>AI Recipe</Text>
        {/* <Text style={styles.subtitle}>Recipe</Text> */}

        <Text style={styles.label}>Ingredients</Text>
        <TextInput
          placeholder="e.g. chicken, onion, garlic"
          placeholderTextColor="#9B9A9A"
          value={ingredients}
          onChangeText={setIngredients}
          style={styles.textInput}
        />

        <Text style={styles.label}>Meal Type</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={mealTypes}
          labelField="label"
          valueField="value"
          value={mealType}
          placeholder="Select meal type"
          onChange={item => setMealType(item.value)}
        />

        <Text style={styles.label}>Cuisine</Text>
        <TextInput
          value={cuisine}
          onChangeText={setCuisine}
          style={styles.textInput}
          placeholder="e.g. Italian, Vietnamese"
          placeholderTextColor="#9B9A9A"
        />

        <Text style={styles.label}>Cooking Time</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={cookingTimes}
          labelField="label"
          valueField="value"
          value={cookingTime}
          placeholder="Select cooking time"
          onChange={item => setCookingTime(item.value)}
        />

        <Text style={styles.label}>Complexity</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={complexityOptions}
          labelField="label"
          valueField="value"
          value={complexity}
          placeholder="Select complexity"
          onChange={item => setComplexity(item.value)}
        />

        <TouchableOpacity onPress={handleGenerate} style={styles.button}>
          <Text style={styles.buttonText}>GENERATE RECIPE</Text>
        </TouchableOpacity>

        <View style={styles.recipeBox}>
          <Text style={styles.recipeText}>
            {loading ? 'Generating recipe...' : recipeText}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 60,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 40,
    marginTop: Platform.OS === 'ios' ? 0 : 30,
  },
  subtitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 30,
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#737B98',
    marginBottom: 6,
    marginTop: 20,
  },
  textInput: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 10,
    padding: 12,
    color: '#000',
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#A3E635',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#111827',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  recipeBox: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    // borderWidth: 1,
    // borderColor: '#E5E7EB',
  },
  recipeText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    lineHeight: 22,
  },
});
