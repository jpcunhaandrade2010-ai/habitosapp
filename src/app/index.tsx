import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Habito = {
  id: string;
  nome: string;
  feitoHoje: boolean;
};

const CHAVE = '@habitos';

export default function DefHabito() {
  const [textoNovoHabito, setTextoNovoHabito] = useState('');
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE);
        if (salvo !== null) {
          setHabitos(JSON.parse(salvo));
        }
      } catch (erro) {
        console.log('Erro ao carregar', erro);
      }
      setCarregado(true);
    }
    carregar();
  }, []);

  useEffect(() => {
    if (!carregado) return;
    AsyncStorage.setItem(CHAVE, JSON.stringify(habitos));
  }, [habitos, carregado]);

  function adicionarHabito() {
    if (textoNovoHabito.trim() === '') return;

    const novoHabito: Habito = {
      id: Date.now().toString(),
      nome: textoNovoHabito,
      feitoHoje: false,
    };

    setHabitos([...habitos, novoHabito]);
    setTextoNovoHabito('');
  }

  function alternarFeito(id: string) {
    const habitosAtualizados = habitos.map((habito) => {
      if (habito.id === id) {
        return { ...habito, feitoHoje: !habito.feitoHoje };
      }
      return habito;
    });
    setHabitos(habitosAtualizados);
  }

  function excluirHabito(id: string) {
    setHabitos(habitos.filter((h) => h.id !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Hábitos</Text>

      <View style={styles.linhaInput}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Beber água"
          value={textoNovoHabito}
          onChangeText={setTextoNovoHabito}
        />
        <Button title="Adicionar" onPress={adicionarHabito} />
      </View>

      <FlatList
        data={habitos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemHabito}>
            <TouchableOpacity
              style={styles.areaTexto}
              onPress={() => alternarFeito(item.id)}
            >
              <Text
                style={[
                  styles.textoHabito,
                  item.feitoHoje && styles.textoFeito,
                ]}
              >
                {item.feitoHoje ? '✅' : '⬜'} {item.nome}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => excluirHabito(item.id)}>
              <Text style={styles.botaoExcluir}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  linhaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  itemHabito: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  areaTexto: {
    flex: 1,
  },
  textoHabito: {
    fontSize: 16,
  },
  textoFeito: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  botaoExcluir: {
    fontSize: 20,
    paddingHorizontal: 8,
  },
});